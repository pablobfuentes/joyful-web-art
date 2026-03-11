import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SocialAuthButtons from "./SocialAuthButtons";

describe("SocialAuthButtons", () => {
  it("shows a Google logo inside the Google button", () => {
    render(
      <SocialAuthButtons
        dividerText="o continua con"
        googleLabel="Continuar con Google"
        facebookLabel="Continuar con Facebook"
        showFacebook={false}
        onProviderClick={vi.fn()}
      />,
    );

    expect(screen.getByTestId("google-logo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continuar con google/i })).toBeInTheDocument();
  });

  it("calls the provider handler when Google is clicked", () => {
    const onProviderClick = vi.fn();

    render(
      <SocialAuthButtons
        dividerText="o continua con"
        googleLabel="Continuar con Google"
        facebookLabel="Continuar con Facebook"
        showFacebook={false}
        onProviderClick={onProviderClick}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /continuar con google/i }));
    expect(onProviderClick).toHaveBeenCalledWith("google");
  });
});
