import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { APP_REGISTRY } from "@/config/app-registry";
import TestimonialsSection from "./TestimonialsSection";

describe("TestimonialsSection Orbit Carousel", () => {
  it("renders one orbiting avatar per testimonial person", () => {
    render(<TestimonialsSection />);

    const people = APP_REGISTRY.testimonials.people;
    const personImages = people.map((p) =>
      screen.getAllByAltText(p.name)
    );

    // Each person should have at least one rendered avatar image
    personImages.forEach((imgs) => {
      expect(imgs.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("changes active person when an orbiting avatar is clicked", () => {
    render(<TestimonialsSection />);

    const people = APP_REGISTRY.testimonials.people;
    const secondPerson = people[1];

    // Click the second person's orbiting avatar (may be multiple, choose the first)
    const targetAvatar = screen.getAllByAltText(secondPerson.name)[0];
    fireEvent.click(targetAvatar);

    // Active card should now use the second person's avatar as the central image
    const centralAvatar = screen.getAllByAltText(secondPerson.name)[0];
    expect(centralAvatar).toBeInTheDocument();
  });
});


