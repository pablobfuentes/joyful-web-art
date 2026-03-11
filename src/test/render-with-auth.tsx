import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext, type AuthContextValue } from "@/contexts/AuthContext";

type RenderWithAuthOptions = Omit<RenderOptions, "wrapper"> & {
  auth?: Partial<AuthContextValue>;
  route?: string;
};

export function createAuthValue(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    user: null,
    loading: false,
    signIn: async () => ({ error: null }),
    signInWithOAuth: async () => ({ error: null }),
    signOut: async () => {},
    signUp: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ error: null }),
    updatePassword: async () => ({ error: null }),
    updateProfile: async () => ({ error: null }),
    ...overrides,
  };
}

export function renderWithAuth(
  ui: ReactElement,
  { auth, route = "/", ...renderOptions }: RenderWithAuthOptions = {},
) {
  const authValue = createAuthValue(auth);

  return {
    authValue,
    ...render(
      <MemoryRouter
        initialEntries={[route]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AuthContext.Provider value={authValue}>{ui}</AuthContext.Provider>
      </MemoryRouter>,
      renderOptions,
    ),
  };
}
