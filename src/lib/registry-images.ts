/**
 * Map from registry image path (filename) to resolved asset URL.
 * Used so default images from src/assets display when registry path matches.
 * Custom paths (e.g. from public) are used as /path in components.
 */
import heroImage from "@/assets/hero-skincare.jpg";
import problem1 from "@/assets/problem-1.jpg";
import problem2 from "@/assets/problem-2.jpg";
import problem3 from "@/assets/problem-3.jpg";
import step1 from "@/assets/step-1.jpg";
import step2 from "@/assets/step-2.jpg";
import step3 from "@/assets/step-3.jpg";
import step4 from "@/assets/step-4.jpg";

export const REGISTRY_IMAGE_URLS: Record<string, string> = {
  "hero-skincare.jpg": heroImage,
  "problem-1.jpg": problem1,
  "problem-2.jpg": problem2,
  "problem-3.jpg": problem3,
  "step-1.jpg": step1,
  "step-2.jpg": step2,
  "step-3.jpg": step3,
  "step-4.jpg": step4,
};

/** Resolve image src: use bundled asset if path matches, else /path for public. */
export function resolveRegistryImageSrc(path: string | undefined, fallbackUrl: string): string {
  if (!path || !path.trim()) return fallbackUrl;
  const trimmed = path.trim();
  if (REGISTRY_IMAGE_URLS[trimmed]) return REGISTRY_IMAGE_URLS[trimmed];
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
