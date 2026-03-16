/**
 * Admin courier export: fetch all rows from admin_export_courier_et_batch
 * and build one CSV for download in the ET_BatchFile_Multiguia.csv format.
 */

import { supabase } from "@/lib/supabase";

const EXPORT_PAGE_SIZE = 500;

const COURIER_HEADERS = [
  "nombre_destinatario",
  "compania_destinatario",
  "email_destinatario",
  "telefono_destinatario",
  "calle_destinatario",
  "numero_ext_destinatario",
  "numero_int_destinatario",
  "colonia_destinatario",
  "municipio_destinatario",
  "codigo_postal_destinatario",
  "estado_destinatario",
  "pais_destinatario",
  "referencia_ubicacion",
  "guardar_direccion_destino",
  "contenido_paquete",
  "unidad_longitud",
  "unidad_peso",
  "ancho_paquete",
  "alto_paquete",
  "largo_paquete",
  "cantidad",
  "peso",
  "valor_declarado",
  "solicitar_aseguranza",
] as const;

function csvEscape(value: unknown): string {
  if (value == null || value === "") return "";
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

type CourierRow = Record<string, unknown>;

function rowToCourierCsvCells(row: CourierRow): string[] {
  return [
    csvEscape(row.nombre_destinatario),
    csvEscape(row.compania_destinatario),
    csvEscape(row.email_destinatario),
    csvEscape(row.telefono_destinatario),
    csvEscape(row.calle_destinatario),
    csvEscape(row.numero_ext_destinatario),
    csvEscape(row.numero_int_destinatario),
    csvEscape(row.colonia_destinatario),
    csvEscape(row.municipio_destinatario),
    csvEscape(row.codigo_postal_destinatario),
    csvEscape(row.estado_destinatario),
    csvEscape(row.pais_destinatario),
    csvEscape(row.referencia_ubicacion),
    csvEscape(row.guardar_direccion_destino),
    csvEscape(row.contenido_paquete),
    csvEscape(row.unidad_longitud),
    csvEscape(row.unidad_peso),
    csvEscape(row.ancho_paquete),
    csvEscape(row.alto_paquete),
    csvEscape(row.largo_paquete),
    csvEscape(row.cantidad),
    csvEscape(row.peso),
    csvEscape(row.valor_declarado),
    csvEscape(row.solicitar_aseguranza),
  ];
}

export async function fetchAllCourierRows(): Promise<CourierRow[]> {
  const rows: CourierRow[] = [];
  let offset = 0;
  let hasMore = true;
  while (hasMore) {
    const { data, error } = await supabase
      .from("admin_export_courier_et_batch")
      .select("*")
      .range(offset, offset + EXPORT_PAGE_SIZE - 1);
    if (error) throw error;
    const chunk = (data ?? []) as CourierRow[];
    rows.push(...chunk);
    hasMore = chunk.length >= EXPORT_PAGE_SIZE;
    offset += EXPORT_PAGE_SIZE;
  }
  return rows;
}

export function buildAndDownloadCourierCsv(rows: CourierRow[]): void {
  const header = COURIER_HEADERS.join(",");
  const dataRows = rows.map((row) => rowToCourierCsvCells(row).join(","));
  const csv = [header, ...dataRows].join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = String(now.getHours()).padStart(2, "0") + "-" + String(now.getMinutes()).padStart(2, "0");
  a.download = `courier_export_${date}_${time}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function runExportCourierData(): Promise<void> {
  const rows = await fetchAllCourierRows();
  buildAndDownloadCourierCsv(rows);
}

