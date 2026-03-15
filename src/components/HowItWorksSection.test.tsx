import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  CONTENT_STORAGE_KEY,
  CONTENT_STORAGE_VERSION,
  CONTENT_VERSION_KEY,
  RegistryContentProvider,
} from "@/contexts/RegistryContentContext";
import HowItWorksSection from "./HowItWorksSection";

describe("HowItWorksSection", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("does not render the sample routine CTA button", () => {
    render(<HowItWorksSection />);

    expect(
      screen.queryByRole("link", { name: /ve un ejemplo de rutina/i }),
    ).not.toBeInTheDocument();
  });

  it("ignores the stale sample routine CTA stored in localStorage overrides", () => {
    localStorage.setItem(CONTENT_VERSION_KEY, String(CONTENT_STORAGE_VERSION));
    localStorage.setItem(
      CONTENT_STORAGE_KEY,
      JSON.stringify({
        howItWorks: {
          ctaButton: {
            label: "Ve un ejemplo de rutina",
            href: "#experience",
          },
        },
      }),
    );

    render(
      <RegistryContentProvider>
        <HowItWorksSection />
      </RegistryContentProvider>,
    );

    expect(
      screen.queryByRole("link", { name: /ve un ejemplo de rutina/i }),
    ).not.toBeInTheDocument();
  });
});
