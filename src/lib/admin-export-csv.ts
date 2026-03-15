/**
 * Admin export: fetch all rows from admin_export_customers and build one CSV for download.
 * RLS ensures only admins can read the view. Used by AdminCustomers "Export Customer Data" button.
 */

import { supabase } from "@/lib/supabase";

const EXPORT_PAGE_SIZE = 500;
const CSV_HEADERS = [
  "user_id",
  "username",
  "full_name",
  "email",
  "phone_number",
  "address_line_1",
  "address_line_2",
  "city",
  "state",
  "postal_code",
  "country",
  "plan_subscription",
  "subscription_status",
  "subscription_date",
  "next_billing_date",
  "renewal_date",
  "payment_status",
  "last_payment_date",
  "amount_paid",
  "currency",
  "stripe_customer_id",
  "stripe_subscription_id",
  "account_created_at",
  "last_login_at",
  "marketing_opt_in",
  "notes",
  "order_count",
  "total_revenue_per_user",
  "cancellation_date",
  "cancellation_reason",
  "trial_status",
  "failed_payment_count",
  "last_shipment_at",
  "last_tracking_number",
  "last_carrier",
  "next_order_status",
  "next_shipping_at",
] as const;

function formatExportDate(iso: string | null | undefined): string {
  if (iso == null || iso === "") return "";
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${h}:${min}`;
  } catch {
    return "";
  }
}

function csvEscape(value: unknown): string {
  if (value == null || value === "") return "";
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

type ExportRow = Record<string, unknown>;

function rowToCsvCells(row: ExportRow): string[] {
  const subStatus = row.subscription_status as string | undefined;
  return [
    csvEscape(row.user_id),
    "", // username
    csvEscape(row.full_name),
    csvEscape(row.email),
    csvEscape(row.phone),
    csvEscape(row.address_line),
    "", // address_line_2
    csvEscape(row.city),
    csvEscape(row.state),
    csvEscape(row.postal_code),
    csvEscape(row.country),
    csvEscape(row.plan_id),
    csvEscape(row.subscription_status),
    formatExportDate(row.subscription_started_at as string),
    formatExportDate(row.next_billing_at as string),
    formatExportDate(row.next_billing_at as string),
    csvEscape(row.payment_status_for_next_shipment),
    formatExportDate(row.last_payment_date as string),
    "", // amount_paid
    "", // currency
    "", // stripe_customer_id
    "", // stripe_subscription_id
    formatExportDate(row.account_created_at as string),
    "", // last_login_at
    "", // marketing_opt_in
    csvEscape(row.notes),
    csvEscape(row.order_count),
    "", // total_revenue_per_user
    formatExportDate(row.subscription_canceled_at as string),
    csvEscape(row.cancellation_reason),
    subStatus === "trial" ? "trial" : "",
    csvEscape(row.failed_payment_attempts),
    formatExportDate(row.last_shipment_at as string),
    csvEscape(row.last_tracking_number),
    csvEscape(row.last_carrier),
    csvEscape(row.next_order_status),
    formatExportDate(row.next_shipping_at as string),
  ];
}

/**
 * Fetch all rows from admin_export_customers in chunks, then build and return CSV string.
 * Throws on Supabase error.
 */
export async function fetchAllExportRows(): Promise<ExportRow[]> {
  const rows: ExportRow[] = [];
  let offset = 0;
  let hasMore = true;
  while (hasMore) {
    const { data, error } = await supabase
      .from("admin_export_customers")
      .select("*")
      .range(offset, offset + EXPORT_PAGE_SIZE - 1);
    if (error) throw error;
    const chunk = (data ?? []) as ExportRow[];
    rows.push(...chunk);
    hasMore = chunk.length >= EXPORT_PAGE_SIZE;
    offset += EXPORT_PAGE_SIZE;
  }
  return rows;
}

/**
 * Build CSV content (header + data rows) and trigger download.
 * Filename: users_export_YYYY-MM-DD_HH-mm.csv
 */
export function buildAndDownloadCsv(rows: ExportRow[]): void {
  const header = CSV_HEADERS.join(",");
  const dataRows = rows.map((row) => rowToCsvCells(row).join(","));
  const csv = [header, ...dataRows].join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = String(now.getHours()).padStart(2, "0") + "-" + String(now.getMinutes()).padStart(2, "0");
  a.download = `users_export_${date}_${time}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Run full export: fetch all rows, build CSV, download. Throws on error.
 */
export async function runExportCustomerData(): Promise<void> {
  const rows = await fetchAllExportRows();
  buildAndDownloadCsv(rows);
}
