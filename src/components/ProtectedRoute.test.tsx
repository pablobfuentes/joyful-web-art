import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    loading: true,
    signIn: async () => ({ error: null }),
    signOut: async () => {},
    signUp: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ error: null }),
    updatePassword: async () => ({ error: null }),
    updateProfile: async () => ({ error: null }),
  }),
}));

describe("ProtectedRoute", () => {
  it("shows a Spanish loading state while auth is resolving", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ProtectedRoute>
          <div>Private content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });
});
