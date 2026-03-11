import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { APP_REGISTRY } from "@/config/app-registry";
import {
  CONTENT_STORAGE_KEY,
  CONTENT_STORAGE_VERSION,
  CONTENT_VERSION_KEY,
  RegistryContentProvider,
} from "@/contexts/RegistryContentContext";
import ComingSoon from "./ComingSoon";

describe("ComingSoon", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
    document.title = "KumiBox";
    const meta = document.querySelector('meta[name="description"]') ?? document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", "");
    if (!meta.parentElement) document.head.appendChild(meta);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders coming soon content from the app registry", () => {
    render(<ComingSoon />);

    expect(
      screen.getAllByText((_, node) => node?.textContent === APP_REGISTRY.comingSoon.brand.name).length,
    ).toBeGreaterThan(0);
    expect(screen.getByAltText(`${APP_REGISTRY.comingSoon.brand.name} logo`)).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.comingSoon.badgeText)).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.comingSoon.headingPrefix)).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.comingSoon.headingHighlight)).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.comingSoon.description)).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.comingSoon.socialHandle)).toBeInTheDocument();
  });

  it("keeps the title and logo vertically aligned", () => {
    render(<ComingSoon />);

    expect(screen.getByTestId("coming-soon-brand-lockup")).toHaveClass("flex", "items-center", "justify-center");
  });

  it("applies coming soon metadata from the registry", () => {
    render(<ComingSoon />);

    expect(document.title).toBe(APP_REGISTRY.comingSoon.metadata.title);
    expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
      APP_REGISTRY.comingSoon.metadata.description,
    );
  });

  it("uses the configured March 21 noon launch date", () => {
    expect(APP_REGISTRY.comingSoon.launchDateIso).toBe("2026-03-21T12:00:00");
  });

  it("migrates stale stored logo and countdown overrides", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T12:00:00"));

    localStorage.setItem(CONTENT_VERSION_KEY, String(CONTENT_STORAGE_VERSION));
    localStorage.setItem(
      CONTENT_STORAGE_KEY,
      JSON.stringify({
        comingSoon: {
          brand: { emoji: "🦊" },
          launchDateIso: "2026-03-01T10:08:00",
        },
        nav: {
          logoEmoji: "🦊",
        },
      }),
    );

    render(
      <RegistryContentProvider>
        <ComingSoon />
      </RegistryContentProvider>,
    );

    expect(screen.getByAltText(`${APP_REGISTRY.comingSoon.brand.name} logo`)).toBeInTheDocument();
    expect(screen.queryByText("🦊")).not.toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
  });
});
