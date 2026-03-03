import { render } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";

vi.mock("@/lib/utils", async () => {
  const actual = await vi.importActual<typeof import("@/lib/utils")>("@/lib/utils");
  return {
    ...actual,
    registryListToArray: vi.fn(actual.registryListToArray),
  };
});

import { registryListToArray } from "@/lib/utils";
import { APP_REGISTRY } from "@/config/app-registry";
import HeroSection from "./HeroSection";

describe("HeroSection rotatingQuotes", () => {
  it("normalizes rotatingQuotes via registryListToArray", () => {
    render(<HeroSection />);
    expect(registryListToArray).toHaveBeenCalled();
  });

  it("keeps at least three hero rotating quotes in the app registry", () => {
    const quotes = registryListToArray(APP_REGISTRY.hero.rotatingQuotes as unknown as string[]);
    expect(quotes.length).toBeGreaterThanOrEqual(3);
  });
});

