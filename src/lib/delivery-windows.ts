/**
 * Bi-monthly subscription delivery windows (quincenas).
 * First delivery = next month, same half; then every +2 months.
 * All dates interpreted in local time.
 */

export type Half = "Primera quincena" | "Segunda quincena";

export type DeliveryWindow = {
  half: Half;
  month: number; // 1–12
  year: number;
};

export type DeliveryWindowsResult = {
  subscriptionHalf: Half;
  windows: DeliveryWindow[];
};

const NUM_WINDOWS = 6;
const MONTHS_BETWEEN_DELIVERIES = 2;

/**
 * Returns subscription half from calendar day (1–15 = primera quincena, 16–end = segunda quincena).
 */
export function getHalfFromDay(day: number): Half {
  return day <= 15 ? "Primera quincena" : "Segunda quincena";
}

/**
 * Computes the next 6 delivery windows for a subscription starting on selectedDate.
 * First delivery is in the month after the subscription month, same half.
 * Each subsequent delivery is +2 months.
 */
export function getDeliveryWindows(selectedDate: Date): DeliveryWindowsResult {
  const day = selectedDate.getDate();
  const subscriptionHalf = getHalfFromDay(day);

  const startMonth = selectedDate.getMonth(); // 0–11
  const startYear = selectedDate.getFullYear();

  // First delivery: next calendar month, same half
  let deliveryMonth = startMonth + 1;
  let deliveryYear = startYear;
  if (deliveryMonth > 11) {
    deliveryMonth -= 12;
    deliveryYear += 1;
  }

  const windows: DeliveryWindow[] = [];
  for (let i = 0; i < NUM_WINDOWS; i++) {
    windows.push({
      half: subscriptionHalf,
      month: deliveryMonth + 1, // 1–12 for display
      year: deliveryYear,
    });
    deliveryMonth += MONTHS_BETWEEN_DELIVERIES;
    if (deliveryMonth > 11) {
      deliveryMonth -= 12;
      deliveryYear += 1;
    }
  }

  return { subscriptionHalf, windows };
}
