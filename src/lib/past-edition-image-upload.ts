/**
 * Past Editions carousel: validate local image files and persist URLs.
 * In dev, POSTs to Vite middleware to write under public/past-editions/.
 * Outside dev (or if upload fails), falls back to a data URL so Save still persists.
 */

export const PAST_EDITION_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export function validatePastEditionImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Selecciona un archivo de imagen (JPEG, PNG, WebP, GIF, etc.).";
  }
  if (file.size > PAST_EDITION_IMAGE_MAX_BYTES) {
    return "La imagen no debe superar 5 MB.";
  }
  return null;
}

function extensionForMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  if (mime === "image/svg+xml") return "svg";
  return "jpg";
}

/**
 * Returns a public URL path (e.g. /past-editions/...) or a data: URL for offline persistence.
 */
export async function resolvePastEditionImageUrl(file: File): Promise<string> {
  const err = validatePastEditionImageFile(file);
  if (err) throw new Error(err);

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });

  const comma = dataUrl.indexOf(",");
  if (comma === -1) throw new Error("Formato de imagen no válido.");
  const base64 = dataUrl.slice(comma + 1);
  const mime = file.type || "image/jpeg";

  if (import.meta.env.DEV) {
    try {
      const res = await fetch("/__registry-upload-past-edition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64,
          mimeType: mime,
          originalName: file.name,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        path?: string;
        error?: string;
      };
      if (res.ok && typeof data.path === "string" && data.path.startsWith("/")) {
        return data.path;
      }
      const msg = data.error ?? "No se pudo guardar la imagen en public/.";
      devWarn("[past-edition-image]", msg, "Falling back to data URL.");
    } catch (e) {
      devWarn("[past-edition-image] Upload request failed, using data URL:", e);
    }
  }

  return dataUrl;
}

function devWarn(...args: unknown[]): void {
  if (import.meta.env.DEV) console.warn(...args);
}

export type PastEditionEntry = {
  name: string;
  category: string;
  month: string;
  image: string;
};

export function defaultPastEditionEntry(): PastEditionEntry {
  return {
    name: "Nueva edición",
    category: "Categoría",
    month: "",
    image: "",
  };
}
