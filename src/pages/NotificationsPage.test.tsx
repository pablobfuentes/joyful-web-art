import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { APP_REGISTRY } from "@/config/app-registry";
import NotificationsPage from "./NotificationsPage";

function renderNotificationsPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <NotificationsPage />
      </AuthProvider>
    </MemoryRouter>,
  );
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
  });
});

