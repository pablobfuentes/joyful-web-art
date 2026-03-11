import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { APP_REGISTRY } from "@/config/app-registry";
import NotificationsPage from "./NotificationsPage";
import { renderWithAuth } from "@/test/render-with-auth";

function renderNotificationsPage() {
  return renderWithAuth(<NotificationsPage />);
}

describe("NotificationsPage", () => {
  it("renders title, subtitle, and body copy from registry", () => {
    renderNotificationsPage();

    expect(
      screen.getByRole("heading", {
        name: APP_REGISTRY.notifications.title,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(APP_REGISTRY.notifications.subtitle),
    ).toBeInTheDocument();

    expect(
      screen.getByText(APP_REGISTRY.notifications.body),
    ).toBeInTheDocument();

    const backLink = screen.getByRole("link", { name: "Volver al panel" });
    expect(backLink).toHaveAttribute("href", "/dashboard");
  });
});

