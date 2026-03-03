import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { APP_REGISTRY } from "@/config/app-registry";
import PastEditionsSection from "./PastEditionsSection";

describe("PastEditionsSection carousel", () => {
  it("renders one item per past edition and marks the middle one as active", () => {
    render(<PastEditionsSection />);

    const editions = APP_REGISTRY.pastEditions.editions;
    const items = screen.getAllByRole("listitem");

    expect(items.length).toBe(editions.length);

    const expectedActiveIndex = Math.floor(editions.length / 2);
    expect(items[expectedActiveIndex]).toHaveAttribute("aria-current", "true");
  });

  it("changes the active item when a different edition is clicked", () => {
    render(<PastEditionsSection />);

    const items = screen.getAllByRole("listitem");
    const first = items[0];

    // Sanity check: first item is not active initially
    expect(first).not.toHaveAttribute("aria-current", "true");

    fireEvent.click(first);

    expect(first).toHaveAttribute("aria-current", "true");
  });
});

