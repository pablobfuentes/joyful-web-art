import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { APP_REGISTRY } from "@/config/app-registry";
import OrderHistory from "./OrderHistory";

function renderOrderHistory() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <OrderHistory />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("OrderHistory page", () => {
  it("renders title, subtitle, and empty state copy from registry", () => {
    renderOrderHistory();

    expect(
      screen.getByRole("heading", { name: APP_REGISTRY.orderHistory.title }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(APP_REGISTRY.orderHistory.subtitle),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: APP_REGISTRY.orderHistory.emptyStateTitle,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(APP_REGISTRY.orderHistory.emptyStateDescription),
    ).toBeInTheDocument();

    const backLink = screen.getByRole("link", { name: "Back to dashboard" });
    expect(backLink).toHaveAttribute("href", "/dashboard");
  });
});

