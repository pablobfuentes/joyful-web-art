import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { APP_REGISTRY } from "@/config/app-registry";
import DeliveryWindowsSection from "./DeliveryWindowsSection";

describe("DeliveryWindowsSection", () => {
  it("renders title and description from registry", () => {
    render(<DeliveryWindowsSection />);
    expect(screen.getByText(APP_REGISTRY.deliveryWindows.title)).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.deliveryWindows.description)).toBeInTheDocument();
  });

  it("renders date picker label and shows six delivery windows", () => {
    render(<DeliveryWindowsSection />);
    expect(screen.getByText(APP_REGISTRY.deliveryWindows.datePickerLabel)).toBeInTheDocument();
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(6);
  });

  it("shows subscription group label and delivery list heading", () => {
    render(<DeliveryWindowsSection />);
    expect(screen.getByText(APP_REGISTRY.deliveryWindows.subscriptionGroupLabel)).toBeInTheDocument();
    expect(screen.getByText(APP_REGISTRY.deliveryWindows.deliveryListHeading)).toBeInTheDocument();
  });

  it("renders delivery window labels in Spanish", () => {
    render(<DeliveryWindowsSection />);
    const firstWindow = screen.getAllByRole("listitem")[0];
    expect(firstWindow.textContent).toMatch(
      /(Primera quincena|Segunda quincena) de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
    );
  });
});
