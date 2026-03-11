import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { APP_REGISTRY } from "@/config/app-registry";
import SubscriptionManagement from "./SubscriptionManagement";
import { renderWithAuth } from "@/test/render-with-auth";

function renderSubscriptionManagement() {
  return renderWithAuth(<SubscriptionManagement />);
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

    const backLink = screen.getByRole("link", { name: "Volver al panel" });
    expect(backLink).toHaveAttribute("href", "/dashboard");
  });
});

