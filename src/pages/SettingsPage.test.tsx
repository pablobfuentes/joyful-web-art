import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { APP_REGISTRY } from "@/config/app-registry";
import SettingsPage from "./SettingsPage";

function renderSettingsPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <SettingsPage />
      </AuthProvider>
    </MemoryRouter>,
  );
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

    const backLink = screen.getByRole("link", { name: "Back to dashboard" });
    expect(backLink).toHaveAttribute("href", "/dashboard");
  });
});

