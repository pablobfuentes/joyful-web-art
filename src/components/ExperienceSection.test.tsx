import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/utils", async () => {
  const actual = await vi.importActual<typeof import("@/lib/utils")>("@/lib/utils");
  return {
    ...actual,
    registryListToArray: vi.fn(actual.registryListToArray),
  };
});

import { registryListToArray } from "@/lib/utils";
import { APP_REGISTRY } from "@/config/app-registry";
import ExperienceSection from "./ExperienceSection";

describe("ExperienceSection", () => {
  it("normalizes experience steps via registryListToArray", () => {
    render(<ExperienceSection />);
    expect(registryListToArray).toHaveBeenCalled();
  });

  it("renders one step marker per experience step using data-step attributes", () => {
    const steps = registryListToArray(APP_REGISTRY.experience.steps as unknown as string[]);
    render(<ExperienceSection />);
    const markers = document.querySelectorAll("[data-step]");
    expect(markers.length).toBe(steps.length);
  });

  it("renders closing copy and bottom CTA from the registry", () => {
    const closing = (APP_REGISTRY.experience as any).closing;
    const { getByText, getByRole } = render(<ExperienceSection />);
    expect(getByText(closing.overline)).toBeInTheDocument();
    expect(getByText(closing.body)).toBeInTheDocument();
    const bottomCta = getByRole("link", { name: new RegExp(closing.ctaLabel, "i") });
    expect(bottomCta).toHaveAttribute("href", closing.ctaHref);
  });

  it("renders top body paragraph from the registry", () => {
    const topBody = (APP_REGISTRY.experience as any).topBody;
    const { getByText } = render(<ExperienceSection />);
    expect(getByText(topBody)).toBeInTheDocument();
  });

  it("renders the animated vertical line in the timeline", () => {
    render(<ExperienceSection />);
    const line = document.querySelector('[data-testid="experience-vertical-line"]');
    expect(line).not.toBeNull();
  });
});

