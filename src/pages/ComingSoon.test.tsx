import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { APP_REGISTRY } from "@/config/app-registry";
import ComingSoon from "./ComingSoon";

describe("ComingSoon", () => {
  beforeEach(() => {
    document.title = "KumiBox";
    const meta = document.querySelector('meta[name="description"]') ?? document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", "");
    if (!meta.parentElement) document.head.appendChild(meta);
  });

  it("renders coming soon content from the app registry", () => {
    render(<ComingSoon />);

    expect(screen.getByText((_, node) => node?.textContent === APP_REGISTRY.comingSoon.brand.name)).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.comingSoon.badgeText)).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.comingSoon.headingPrefix)).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.comingSoon.headingHighlight)).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.comingSoon.description)).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.comingSoon.socialHandle)).toBeInTheDocument();
  });

  it("applies coming soon metadata from the registry", () => {
    render(<ComingSoon />);

    expect(document.title).toBe(APP_REGISTRY.comingSoon.metadata.title);
    expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
      APP_REGISTRY.comingSoon.metadata.description,
    );
  });
});
