import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";

describe("AdminLayout", () => {
  it("includes a preview link to the coming soon page", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AdminLayout />
      </MemoryRouter>,
    );

    const previewLink = screen.getByRole("link", { name: /coming soon/i });
    expect(previewLink).toHaveAttribute("href", "/coming-soon");
  });
});
