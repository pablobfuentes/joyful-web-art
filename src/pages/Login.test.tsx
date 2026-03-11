import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import Login from "./Login";
import { APP_REGISTRY } from "@/config/app-registry";
import { renderWithAuth } from "@/test/render-with-auth";

const signIn = vi.fn();

function renderLogin() {
  return renderWithAuth(<Login />, {
    auth: {
      signIn,
    },
  });
}

describe("Login", () => {
  it("shows a Spanish loading label while signing in", async () => {
    signIn.mockImplementation(() => new Promise(() => {}));
    renderLogin();

    fireEvent.change(screen.getByLabelText(APP_REGISTRY.login.emailLabel), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(APP_REGISTRY.login.passwordLabel), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: APP_REGISTRY.login.submitButton }));

    expect(
      screen.getByRole("button", { name: "Iniciando sesion..." }),
    ).toBeInTheDocument();
  });

  it("renders login form with copy from app registry", () => {
    signIn.mockResolvedValue({ error: null });
    renderLogin();
    expect(screen.getByRole("heading", { name: APP_REGISTRY.login.title })).toBeInTheDocument();
    expect(screen.getByLabelText(APP_REGISTRY.login.emailLabel)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(APP_REGISTRY.login.emailPlaceholder)).toBeInTheDocument();
    expect(screen.getByLabelText(APP_REGISTRY.login.passwordLabel)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: APP_REGISTRY.login.submitButton })).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.login.noAccountText)).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("link", { name: APP_REGISTRY.login.signUpLink })
        .some((link) => link.getAttribute("href") === APP_REGISTRY.login.signUpHref),
    ).toBe(true);
  });

  it("has link to forgot password", () => {
    signIn.mockResolvedValue({ error: null });
    renderLogin();
    const forgot = screen.getByRole("link", { name: APP_REGISTRY.login.forgotPassword });
    expect(forgot).toHaveAttribute("href", APP_REGISTRY.login.forgotPasswordHref);
  });
});
