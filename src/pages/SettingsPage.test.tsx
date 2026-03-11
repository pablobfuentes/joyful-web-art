import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { APP_REGISTRY } from "@/config/app-registry";
import SettingsPage from "./SettingsPage";
import { renderWithAuth } from "@/test/render-with-auth";

function renderSettingsPage() {
  return renderWithAuth(<SettingsPage />);
}

describe("SettingsPage", () => {
  it("renders title, subtitle, and body copy from registry", () => {
    renderSettingsPage();

    expect(
      screen.getByRole("heading", {
        name: APP_REGISTRY.settings.title,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(APP_REGISTRY.settings.subtitle),
    ).toBeInTheDocument();

    expect(
      screen.getByText(APP_REGISTRY.settings.body),
    ).toBeInTheDocument();

    const backLink = screen.getByRole("link", { name: "Volver al panel" });
    expect(backLink).toHaveAttribute("href", "/dashboard");
  });
});

