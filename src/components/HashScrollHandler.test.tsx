import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useEffect, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import HashScrollHandler from "./HashScrollHandler";

describe("HashScrollHandler", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("scrolls to the hash target after navigating back to the landing page", async () => {
    const scrollIntoView = vi.fn();
    const original = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scrollIntoView;

    render(
      <MemoryRouter
        initialEntries={["/checkout"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <HashScrollHandler />
        <Routes>
          <Route path="/" element={<section id="pricing">Pricing</section>} />
          <Route path="/checkout" element={<Link to="/#pricing">Volver a planes</Link>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Volver a planes" }));

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    });

    HTMLElement.prototype.scrollIntoView = original;
  });

  it("keeps retrying briefly when the hash target renders after navigation", async () => {
    const scrollIntoView = vi.fn();
    const original = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scrollIntoView;

    function DelayedPricingSection() {
      const [ready, setReady] = useState(false);

      useEffect(() => {
        const timer = window.setTimeout(() => setReady(true), 50);
        return () => window.clearTimeout(timer);
      }, []);

      return ready ? <section id="pricing">Pricing</section> : <div>Loading pricing…</div>;
    }

    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/", hash: "#pricing" }]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <HashScrollHandler />
        <Routes>
          <Route path="/" element={<DelayedPricingSection />} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByText("Pricing");

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    });

    HTMLElement.prototype.scrollIntoView = original;
  });
});
