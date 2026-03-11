import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/ui/toaster", () => ({ Toaster: () => null }));
vi.mock("@/components/ui/sonner", () => ({ Toaster: () => null }));
vi.mock("@/components/ui/tooltip", () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/contexts/RegistryContentContext", () => ({
  RegistryContentProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/contexts/StyleRegistryContext", () => ({
  StyleRegistryProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/ProtectedRoute", () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/AdminRoute", () => ({
  AdminRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/AdminLayout", () => ({
  AdminLayout: () => <div>Admin Layout</div>,
}));

vi.mock("./pages/ComingSoon", () => ({
  default: () => <div>Coming Soon Page</div>,
}));
vi.mock("./pages/Index", () => ({
  default: () => <div>Full Site Page</div>,
}));
vi.mock("./pages/RegistryEditor", () => ({
  default: () => <div>Registry Editor Page</div>,
}));
vi.mock("./pages/admin/AdminOverview", () => ({
  default: () => <div>Admin Overview Page</div>,
}));
vi.mock("./pages/admin/AdminCustomers", () => ({
  default: () => <div>Admin Customers Page</div>,
}));
vi.mock("./pages/admin/AdminCustomerDetail", () => ({
  default: () => <div>Admin Customer Detail Page</div>,
}));
vi.mock("./pages/Login", () => ({
  default: () => <div>Login Page</div>,
}));
vi.mock("./pages/Register", () => ({
  default: () => <div>Register Page</div>,
}));
vi.mock("./pages/ForgotPassword", () => ({
  default: () => <div>Forgot Password Page</div>,
}));
vi.mock("./pages/ResetPassword", () => ({
  default: () => <div>Reset Password Page</div>,
}));
vi.mock("./pages/Dashboard", () => ({
  default: () => <div>Dashboard Page</div>,
}));
vi.mock("./pages/Checkout", () => ({
  default: () => <div>Checkout Page</div>,
}));
vi.mock("./pages/CheckoutSuccess", () => ({
  default: () => <div>Checkout Success Page</div>,
}));
vi.mock("./pages/CheckoutCancel", () => ({
  default: () => <div>Checkout Cancel Page</div>,
}));
vi.mock("./pages/OrderHistory", () => ({
  default: () => <div>Order History Page</div>,
}));
vi.mock("./pages/SubscriptionManagement", () => ({
  default: () => <div>Subscription Management Page</div>,
}));
vi.mock("./pages/SettingsPage", () => ({
  default: () => <div>Settings Page</div>,
}));
vi.mock("./pages/NotificationsPage", () => ({
  default: () => <div>Notifications Page</div>,
}));
vi.mock("./pages/Privacy", () => ({
  default: () => <div>Privacy Page</div>,
}));
vi.mock("./pages/Terms", () => ({
  default: () => <div>Terms Page</div>,
}));

import App from "./App";

describe("App routes", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("renders the full site at root", () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    expect(screen.getByText("Full Site Page")).toBeInTheDocument();
  });

  it("renders the coming soon page at /coming-soon", () => {
    window.history.pushState({}, "", "/coming-soon");
    render(<App />);
    expect(screen.getByText("Coming Soon Page")).toBeInTheDocument();
  });
});
