import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { APP_REGISTRY } from "@/config/app-registry";
import SubscriptionManagement from "./SubscriptionManagement";

function renderSubscriptionManagement() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <SubscriptionManagement />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("SubscriptionManagement page", () => {
  it("renders title, subtitle, and body copy from registry", () => {
    renderSubscriptionManagement();

    expect(
      screen.getByRole("heading", {
        name: APP_REGISTRY.subscriptionManagement.title,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(APP_REGISTRY.subscriptionManagement.subtitle),
    ).toBeInTheDocument();

    expect(
      screen.getByText(APP_REGISTRY.subscriptionManagement.body),
    ).toBeInTheDocument();
  });
});

