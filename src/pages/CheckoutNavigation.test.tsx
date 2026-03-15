import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { RegistryContentProvider } from "@/contexts/RegistryContentContext";
import { APP_REGISTRY } from "@/config/app-registry";
import { renderWithAuth } from "@/test/render-with-auth";
import Checkout from "./Checkout";
import CheckoutCancel from "./CheckoutCancel";

vi.mock("@/components/Navbar", () => ({
  default: () => null,
}));

vi.mock("@/components/Doodles", () => ({
  FloatingDoodle: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  DoodleHeart: () => null,
  DoodleSparkle: () => null,
  DoodleStar: () => null,
}));

vi.mock("@/lib/checkout", () => ({
  createCheckoutSession: vi.fn(),
}));

describe("Checkout pricing navigation", () => {
  it("renders the checkout back action as a pricing anchor link", () => {
    renderWithAuth(
      <RegistryContentProvider>
        <Checkout />
      </RegistryContentProvider>,
      { route: "/checkout?plan=gift" },
    );

    expect(screen.getByRole("link", { name: APP_REGISTRY.checkout.backLink })).toHaveAttribute(
      "href",
      "/#pricing",
    );
  });

  it("renders the cancel page pricing action as a pricing anchor link", () => {
    render(
      <MemoryRouter>
        <RegistryContentProvider>
          <CheckoutCancel />
        </RegistryContentProvider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: APP_REGISTRY.checkout.cancelBackToPricing }),
    ).toHaveAttribute("href", "/#pricing");
  });
});
