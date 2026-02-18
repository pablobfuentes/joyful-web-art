import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./Login";
import { APP_REGISTRY } from "@/config/app-registry";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      signInWithPassword: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  },
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("Login", () => {
  it("renders login form with copy from app registry", () => {
    renderLogin();
    expect(screen.getByRole("heading", { name: APP_REGISTRY.login.title })).toBeInTheDocument();
    expect(screen.getByLabelText(APP_REGISTRY.login.emailLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(APP_REGISTRY.login.passwordLabel)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: APP_REGISTRY.login.submitButton })).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.login.noAccountText)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: APP_REGISTRY.login.signUpLink })).toHaveAttribute(
      "href",
      APP_REGISTRY.login.signUpHref,
    );
  });

  it("has link to forgot password", () => {
    renderLogin();
    const forgot = screen.getByRole("link", { name: APP_REGISTRY.login.forgotPassword });
    expect(forgot).toHaveAttribute("href", APP_REGISTRY.login.forgotPasswordHref);
  });
});
