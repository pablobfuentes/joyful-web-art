import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { APP_REGISTRY } from "@/config/app-registry";
import { renderWithAuth } from "@/test/render-with-auth";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders the configured logo image", () => {
    renderWithAuth(<Navbar />);

    expect(screen.getByAltText(`${APP_REGISTRY.nav.logoText} logo`)).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.nav.logoText)).toBeInTheDocument();
  });
});
