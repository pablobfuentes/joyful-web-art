import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

const supabaseAuthMocks = vi.hoisted(() => ({
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
  getSession: vi.fn(),
  unsubscribe: vi.fn(),
  onAuthStateChange: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithOAuth: supabaseAuthMocks.signInWithOAuth,
      signOut: supabaseAuthMocks.signOut,
      signInWithPassword: supabaseAuthMocks.signInWithPassword,
      signUp: supabaseAuthMocks.signUp,
      resetPasswordForEmail: supabaseAuthMocks.resetPasswordForEmail,
      updateUser: supabaseAuthMocks.updateUser,
      getSession: supabaseAuthMocks.getSession,
      onAuthStateChange: supabaseAuthMocks.onAuthStateChange,
    },
  },
}));

function TestConsumer() {
  const { signInWithOAuth } = useAuth() as unknown as {
    signInWithOAuth: (provider: "google" | "facebook") => Promise<{ error: Error | null }>;
  };

  return (
    <button type="button" onClick={() => void signInWithOAuth("google")}>
      oauth
    </button>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabaseAuthMocks.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: supabaseAuthMocks.unsubscribe,
        },
      },
    });
    supabaseAuthMocks.getSession.mockResolvedValue({ data: { session: null } });
    supabaseAuthMocks.signInWithOAuth.mockResolvedValue({ error: null });
  });

  it("calls Supabase OAuth sign-in with the selected provider", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "oauth" }));

    await waitFor(() => {
      expect(supabaseAuthMocks.signInWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: "google",
        }),
      );
    });
  });
});
