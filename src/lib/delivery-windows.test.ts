import { describe, it, expect } from "vitest";
import { getDeliveryWindows, getHalfFromDay } from "./delivery-windows";

describe("getHalfFromDay", () => {
  it("returns Primera quincena for days 1–15", () => {
    expect(getHalfFromDay(1)).toBe("Primera quincena");
    expect(getHalfFromDay(15)).toBe("Primera quincena");
  });
  it("returns Segunda quincena for days 16–31", () => {
    expect(getHalfFromDay(16)).toBe("Segunda quincena");
    expect(getHalfFromDay(31)).toBe("Segunda quincena");
  });
});

describe("getDeliveryWindows", () => {
  it("subscription Jan 10: Primera quincena, first delivery Feb then Apr Jun Aug Oct Dec", () => {
    const date = new Date(2026, 0, 10); // Jan 10, 2026
    const { subscriptionHalf, windows } = getDeliveryWindows(date);
    expect(subscriptionHalf).toBe("Primera quincena");
    expect(windows).toHaveLength(6);
    expect(windows[0]).toEqual({ half: "Primera quincena", month: 2, year: 2026 }); // February
    expect(windows[1]).toEqual({ half: "Primera quincena", month: 4, year: 2026 });
    expect(windows[2]).toEqual({ half: "Primera quincena", month: 6, year: 2026 });
    expect(windows[3]).toEqual({ half: "Primera quincena", month: 8, year: 2026 });
    expect(windows[4]).toEqual({ half: "Primera quincena", month: 10, year: 2026 });
    expect(windows[5]).toEqual({ half: "Primera quincena", month: 12, year: 2026 });
  });

  it("subscription Jan 25: Segunda quincena, same month sequence", () => {
    const date = new Date(2026, 0, 25); // Jan 25, 2026
    const { subscriptionHalf, windows } = getDeliveryWindows(date);
    expect(subscriptionHalf).toBe("Segunda quincena");
    expect(windows[0]).toEqual({ half: "Segunda quincena", month: 2, year: 2026 });
    expect(windows[5]).toEqual({ half: "Segunda quincena", month: 12, year: 2026 });
  });

  it("subscription Mar 7: Primera quincena, first delivery Apr then Jun Aug Oct Dec Feb next year", () => {
    const date = new Date(2026, 2, 7); // Mar 7, 2026
    const { subscriptionHalf, windows } = getDeliveryWindows(date);
    expect(subscriptionHalf).toBe("Primera quincena");
    expect(windows[0]).toEqual({ half: "Primera quincena", month: 4, year: 2026 });
    expect(windows[1]).toEqual({ half: "Primera quincena", month: 6, year: 2026 });
    expect(windows[2]).toEqual({ half: "Primera quincena", month: 8, year: 2026 });
    expect(windows[3]).toEqual({ half: "Primera quincena", month: 10, year: 2026 });
    expect(windows[4]).toEqual({ half: "Primera quincena", month: 12, year: 2026 });
    expect(windows[5]).toEqual({ half: "Primera quincena", month: 2, year: 2027 });
  });

  it("subscription Mar 22: Segunda quincena, same month sequence with year rollover", () => {
    const date = new Date(2026, 2, 22); // Mar 22, 2026
    const { subscriptionHalf, windows } = getDeliveryWindows(date);
    expect(subscriptionHalf).toBe("Segunda quincena");
    expect(windows[5]).toEqual({ half: "Segunda quincena", month: 2, year: 2027 });
  });

  it("subscription Dec 7: Primera quincena, first delivery Jan next year then Mar May Jul Sep Nov", () => {
    const date = new Date(2026, 11, 7); // Dec 7, 2026
    const { subscriptionHalf, windows } = getDeliveryWindows(date);
    expect(subscriptionHalf).toBe("Primera quincena");
    expect(windows[0]).toEqual({ half: "Primera quincena", month: 1, year: 2027 });
    expect(windows[1]).toEqual({ half: "Primera quincena", month: 3, year: 2027 });
    expect(windows[2]).toEqual({ half: "Primera quincena", month: 5, year: 2027 });
    expect(windows[3]).toEqual({ half: "Primera quincena", month: 7, year: 2027 });
    expect(windows[4]).toEqual({ half: "Primera quincena", month: 9, year: 2027 });
    expect(windows[5]).toEqual({ half: "Primera quincena", month: 11, year: 2027 });
  });
});
