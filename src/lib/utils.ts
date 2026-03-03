import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes registry list data to an array in numeric index order (0, 1, 2, ...).
 * Use whenever section content may be an array or an object with numeric keys
 * (e.g. after localStorage overrides or merge). Ensures correct order and avoids
 * .map() errors; does not add, remove, or change any content.
 */
export function registryListToArray<T>(value: T[] | Record<string, T> | null | undefined): T[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value !== "object") return [];
  const obj = value as Record<string, T>;
  const keys = Object.keys(obj).filter((k) => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
  return keys.map((k) => obj[k]);
}
