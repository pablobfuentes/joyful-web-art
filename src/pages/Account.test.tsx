import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import Account from "./Account";
import { APP_REGISTRY } from "@/config/app-registry";
import { renderWithAuth } from "@/test/render-with-auth";

const mockUser = {
  id: "user-1",
  email: "user@example.com",
  created_at: "2025-01-15T00:00:00Z",
  user_metadata: { full_name: "Test User" },
};

function renderAccount() {
  return renderWithAuth(<Account />, {
    auth: {
      user: mockUser,
    },
  });
}

describe("Account", () => {
  it("renders title and subtitle from app registry", async () => {
    renderAccount();
    expect(
      screen.getByRole("heading", { name: APP_REGISTRY.account.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.account.subtitle)).toBeInTheDocument();
  });

  it("shows profile summary with user email, name, and member since", async () => {
    renderAccount();
    await screen.findByText(mockUser.email);
    expect(screen.getAllByText("Test User").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(APP_REGISTRY.account.profileTitle),
    ).toBeInTheDocument();
  });

  it("links Edit profile to dashboard and Change password to forgot-password", async () => {
    renderAccount();
    await screen.findByText(mockUser.email);
    const editProfile = screen.getByRole("link", {
      name: APP_REGISTRY.account.editProfileLabel,
    });
    expect(editProfile).toHaveAttribute("href", APP_REGISTRY.account.editProfileHref);
    const changePassword = screen.getByRole("link", {
      name: APP_REGISTRY.account.changePasswordLabel,
    });
    expect(changePassword).toHaveAttribute(
      "href",
      APP_REGISTRY.account.changePasswordHref,
    );
  });

  it("links Back to Dashboard to dashboard", async () => {
    renderAccount();
    await screen.findByText(mockUser.email);
    const back = screen.getByRole("link", {
      name: APP_REGISTRY.account.backToDashboard,
    });
    expect(back).toHaveAttribute("href", APP_REGISTRY.account.backToDashboardHref);
  });
});
