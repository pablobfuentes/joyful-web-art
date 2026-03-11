import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TestimonialsSection from "./TestimonialsSection";

describe("TestimonialsSection", () => {
  it("does not render while testimonials are intentionally disabled", () => {
    const { container } = render(<TestimonialsSection />);
    expect(container).toBeEmptyDOMElement();
  });
});
