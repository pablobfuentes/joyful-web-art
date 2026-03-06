import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

const PAGE_SIZE = 20;
const SORT_COLUMNS = ["customer_name", "customer_email", "subscription_status", "next_shipping_at", "last_update"] as const;

async function fetchCustomersList(page: number, sortBy: string, sortAsc: boolean, search: string) {
  let q = supabase
    .from("admin_customers_list")
    .select("*", { count: "exact" })
    .order(sortBy, { ascending: sortAsc })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (search.trim()) {
    q = q.or(`customer_name.ilike.%${search.trim()}%,customer_email.ilike.%${search.trim()}%`);
  }
  const { data, error, count } = await q;
  if (error) throw error;
  return { rows: data ?? [], total: count ?? 0 };
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: "short" });
  } catch {
    return "—";
  }
}

/**
 * Admin customers table: sortable, filterable, paginated; link to customer detail.
 * Data from view admin_customers_list (RLS via underlying tables).
 */
export default function AdminCustomers() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>(SORT_COLUMNS[0]);
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-customers", page, sortBy, sortAsc, search],
    queryFn: () => fetchCustomersList(page, sortBy, sortAsc, search),
    placeholderData: keepPreviousData,
  });

  const totalPages = useMemo(
    () => (data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1),
    [data]
  );

  function exportCsv() {
    if (!data?.rows?.length) return;
    const cols = ["customer_name", "customer_email", "customer_phone", "plan_id", "subscription_status", "next_shipping_at", "next_order_status", "last_update"];
    const header = cols.join(",");
    const escape = (v: unknown) => (v == null ? "" : String(v).includes(",") ? `"${String(v).replace(/"/g, '""')}"` : String(v));
    const rows = data.rows.map((row: Record<string, unknown>) => cols.map((c) => escape(row[c])).join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-customers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold">Customers</h1>
        <p className="text-destructive">
          Failed to load customers. Run the Phase 2 migration (admin_customers_list view). {String((error as Error).message)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Customers</h1>
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-base">Customer list</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={!data?.rows?.length}>
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
            <Input
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-xs"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border bg-background px-2 py-1.5 text-sm"
            >
              {SORT_COLUMNS.map((c) => (
                <option key={c} value={c}>
                  Sort by {c.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm" onClick={() => setSortAsc((a) => !a)}>
              {sortAsc ? "↑" : "↓"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground py-8">Loading…</p>
          ) : !data?.rows?.length ? (
            <p className="text-muted-foreground py-8">No customers found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Next shipping</TableHead>
                    <TableHead>Next order status</TableHead>
                    <TableHead>Last update</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.rows.map((row: Record<string, unknown>) => (
                    <TableRow key={String(row.user_id)}>
                      <TableCell className="font-medium">{String(row.customer_name ?? "—")}</TableCell>
                      <TableCell>{String(row.customer_email ?? "—")}</TableCell>
                      <TableCell>{String(row.plan_id ?? "—")}</TableCell>
                      <TableCell>{String(row.subscription_status ?? "—")}</TableCell>
                      <TableCell>{formatDate(row.next_shipping_at as string)}</TableCell>
                      <TableCell>{String(row.next_order_status ?? "—")}</TableCell>
                      <TableCell>{formatDate(row.last_update as string)}</TableCell>
                      <TableCell>
                        <Link
                          to={`/admin/customers/${row.user_id}`}
                          className="text-primary text-sm font-medium hover:underline"
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  {data.total} customer{data.total !== 1 ? "s" : ""}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="flex items-center px-2 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
