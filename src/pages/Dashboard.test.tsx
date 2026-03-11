import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { APP_REGISTRY } from "@/config/app-registry";
import { renderWithAuth } from "@/test/render-with-auth";

const mockUser = {
  id: "user-1",
  email: "user@example.com",
  created_at: "2025-01-15T00:00:00Z",
  user_metadata: { full_name: "Test User" },
};

function renderDashboard() {
  return renderWithAuth(<Dashboard />, {
    auth: {
      user: mockUser,
    },
  });
}

describe("Dashboard", () => {
  it("renders dashboard actions in Spanish", async () => {
    renderDashboard();
    await screen.findByText(mockUser.email);

    expect(
      screen.getByRole("heading", { name: "Acciones rapidas" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Historial de pedidos" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Suscripcion" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Configuracion" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Notificaciones" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Cerrar sesion" }).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders welcome and account information from app registry", async () => {
    renderDashboard();
    expect(
      screen.getByRole("heading", { name: APP_REGISTRY.dashboard.welcomeTitle }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: APP_REGISTRY.dashboard.accountInfoTitle }),
    ).toBeInTheDocument();
    await screen.findByText(mockUser.email);
    expect(screen.getAllByText("Test User").length).toBeGreaterThanOrEqual(1);
  });

  it("shows Edit profile and Change password actions", async () => {
    renderDashboard();
    await screen.findByText(mockUser.email);
    expect(
      screen.getByRole("button", { name: APP_REGISTRY.dashboard.editProfileButton }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: APP_REGISTRY.dashboard.changePasswordLabel }),
    ).toHaveAttribute("href", APP_REGISTRY.dashboard.changePasswordHref);
  });

  it("links quick actions to dedicated pages", async () => {
    renderDashboard();
    await screen.findByText(mockUser.email);

    expect(
      screen.getByRole("link", { name: APP_REGISTRY.dashboard.orderHistoryTitle }),
    ).toHaveAttribute("href", "/orders");

    expect(
      screen.getByRole("link", { name: APP_REGISTRY.dashboard.subscriptionActionTitle }),
    ).toHaveAttribute("href", "/subscription");

    expect(
      screen.getByRole("link", { name: APP_REGISTRY.dashboard.settingsTitle }),
    ).toHaveAttribute("href", "/settings");

    expect(
      screen.getByRole("link", { name: APP_REGISTRY.dashboard.notificationsTitle }),
    ).toHaveAttribute("href", "/notifications");
  });
});
