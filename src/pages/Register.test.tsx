import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import Register from "./Register";
import { APP_REGISTRY } from "@/config/app-registry";
import { renderWithAuth } from "@/test/render-with-auth";

const signUp = vi.fn();
const signInWithOAuth = vi.fn();

function renderRegister() {
  return renderWithAuth(<Register />, {
    auth: {
      signUp,
      ...( { signInWithOAuth } as object ),
    },
  });
}

describe("Register", () => {
  it("renders register form with copy from app registry", () => {
    signUp.mockResolvedValue({ error: null });
    renderRegister();

    expect(screen.getByRole("heading", { name: APP_REGISTRY.register.title })).toBeInTheDocument();
    expect(screen.getByLabelText(APP_REGISTRY.register.nameLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(APP_REGISTRY.register.emailLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(APP_REGISTRY.register.passwordLabel)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: APP_REGISTRY.register.submitButton }),
    ).toBeInTheDocument();
  });

  it("renders social sign-in buttons and calls the matching provider", async () => {
    signUp.mockResolvedValue({ error: null });
    signInWithOAuth.mockResolvedValue({ error: null });
    renderRegister();

    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /facebook/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /google/i }));
    await waitFor(() => expect(signInWithOAuth).toHaveBeenNthCalledWith(1, "google"));
  });
});
