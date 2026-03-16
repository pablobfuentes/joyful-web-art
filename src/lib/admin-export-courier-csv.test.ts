import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchAllCourierRows, buildAndDownloadCourierCsv, runExportCourierData } from "./admin-export-courier-csv";

const mocks = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockSelect: vi.fn(),
  mockRange: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: mocks.mockFrom,
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.mockFrom.mockReturnValue({ select: mocks.mockSelect });
  mocks.mockSelect.mockReturnValue({ range: mocks.mockRange });
});

describe("admin-export-courier-csv", () => {
  it("fetchAllCourierRows calls admin_export_courier_et_batch and returns rows", async () => {
    const fixture = [
      { nombre_destinatario: "Alice", calle_destinatario: "Calle 1" },
      { nombre_destinatario: "Bob", calle_destinatario: "Calle 2" },
    ];
    mocks.mockRange.mockResolvedValueOnce({ data: fixture, error: null });

    const rows = await fetchAllCourierRows();

    expect(mocks.mockFrom).toHaveBeenCalledWith("admin_export_courier_et_batch");
    expect(mocks.mockSelect).toHaveBeenCalledWith("*");
    expect(mocks.mockRange).toHaveBeenCalledWith(0, 499);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ nombre_destinatario: "Alice" });
  });

  it("fetchAllCourierRows fetches in chunks when more than page size", async () => {
    const chunk1 = Array.from({ length: 500 }, (_, i) => ({ nombre_destinatario: `N-${i}` }));
    const chunk2 = [{ nombre_destinatario: "N-500" }];
    mocks.mockRange.mockResolvedValueOnce({ data: chunk1, error: null });
    mocks.mockRange.mockResolvedValueOnce({ data: chunk2, error: null });

    const rows = await fetchAllCourierRows();

    expect(mocks.mockRange).toHaveBeenCalledWith(0, 499);
    expect(mocks.mockRange).toHaveBeenCalledWith(500, 999);
    expect(rows).toHaveLength(501);
  });

  it("buildAndDownloadCourierCsv produces CSV with headers and filename courier_export_YYYY-MM-DD_HH-mm.csv", () => {
    const rows = [
      { nombre_destinatario: "Test", calle_destinatario: "Calle X" },
    ] as Record<string, unknown>[];
    let capturedBlob: Blob | null = null;
    let capturedDownload = "";
    const createObjectURL = vi.fn((blob: Blob) => {
      capturedBlob = blob;
      return "blob:mock";
    });
    const revokeObjectURL = vi.fn();
    const origCreateElement = document.createElement.bind(document);
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL,
      revokeObjectURL,
    });
    vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      const el = origCreateElement(tagName) as HTMLAnchorElement;
      if (tagName === "a") {
        el.click = () => {
          capturedDownload = el.download ?? "";
        };
      }
      return el;
    });

    buildAndDownloadCourierCsv(rows);

    expect(capturedBlob).not.toBeNull();
    expect(capturedBlob!.type).toBe("text/csv;charset=utf-8;");
    expect(capturedDownload).toMatch(/^courier_export_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}\.csv$/);
  });

  it("runExportCourierData fetches rows and builds CSV blob", async () => {
    const fixture = [{ nombre_destinatario: "Export", calle_destinatario: "Calle Y" }];
    mocks.mockRange.mockResolvedValue({ data: fixture, error: null });
    let capturedBlob: Blob | null = null;
    const createObjectURL = vi.fn((blob: Blob) => {
      capturedBlob = blob;
      return "blob:mock";
    });
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL,
      revokeObjectURL: vi.fn(),
    });

    await runExportCourierData();

    expect(capturedBlob).not.toBeNull();
    expect(capturedBlob!.type).toBe("text/csv;charset=utf-8;");
    expect(capturedBlob!.size).toBeGreaterThan(0);
    expect(createObjectURL).toHaveBeenCalledWith(capturedBlob);
  });

  it("runExportCourierData throws when Supabase returns error", async () => {
    mocks.mockRange.mockResolvedValue({ data: null, error: { message: "RLS denied" } });

    await expect(runExportCourierData()).rejects.toThrow();
  });
});

