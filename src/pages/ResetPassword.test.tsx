import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import ResetPassword from "./ResetPassword";
import { renderWithAuth } from "@/test/render-with-auth";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: () => new Promise(() => {}),
    },
  },
}));

describe("ResetPassword", () => {
  it("shows a Spanish loading state while checking the reset session", () => {
    renderWithAuth(<ResetPassword />);

    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });
});
