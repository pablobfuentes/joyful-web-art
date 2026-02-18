import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "./Dashboard";
import { APP_REGISTRY } from "@/config/app-registry";

const mockUser = {
  id: "user-1",
  email: "user@example.com",
  created_at: "2025-01-15T00:00:00Z",
  user_metadata: { full_name: "Test User" },
};

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: () =>
        Promise.resolve({
          data: {
            session: {
              user: mockUser,
            },
          },
        }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  },
}));

function renderDashboard() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("Dashboard", () => {
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
});
