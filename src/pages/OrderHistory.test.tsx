import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { APP_REGISTRY } from "@/config/app-registry";
import OrderHistory from "./OrderHistory";
import { renderWithAuth } from "@/test/render-with-auth";

function renderOrderHistory() {
  return renderWithAuth(<OrderHistory />);
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

    const backLink = screen.getByRole("link", { name: "Volver al panel" });
    expect(backLink).toHaveAttribute("href", "/dashboard");
  });
});

