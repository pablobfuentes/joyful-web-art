/**
 * Test/demo data for registered users so profile, order history,
 * subscription, and notifications can be previewed without backend data.
 * Subscription is derived from the user's registration date (member since).
 */

export type TestOrder = {
  id: string;
  createdAt: string;
  status: "completed" | "pending" | "cancelled";
  planId: string;
  planLabel: string;
  summary: string;
};

export type TestSubscription = {
  planId: string;
  planName: string;
  status: "active" | "inactive" | "cancelled";
  startedAt: string;
  nextRenewalAt: string;
};

export type TestNotificationPreferences = {
  orderUpdates: boolean;
  subscriptionChanges: boolean;
  productNews: boolean;
};

export type TestUserData = {
  subscription: TestSubscription;
  orders: TestOrder[];
  notificationPreferences: TestNotificationPreferences;
};

const DEFAULT_PLAN_ID = "kumibox-monthly";
const DEFAULT_PLAN_NAME = "KumiBox Monthly";

function addMonths(date: Date, months: number): Date {
  const out = new Date(date);
  out.setMonth(out.getMonth() + months);
  return out;
}

function toISO(date: Date): string {
  return date.toISOString();
}

/**
 * Build test data for a user. Subscription starts at user creation;
 * orders are generated from registration date (first box) then monthly.
 */
export function buildTestUserData(userId: string, createdAt: string): TestUserData {
  const created = new Date(createdAt);
  const now = new Date();

  const startedAt = toISO(created);
  let nextRenewal = new Date(created);
  while (nextRenewal <= now) nextRenewal = addMonths(nextRenewal, 1);
  const nextRenewalAt = toISO(nextRenewal);

  const orders: TestOrder[] = [];
  let d = new Date(created);
  let n = 0;
  while (d <= now && n < 24) {
    orders.push({
      id: `test-order-${userId.slice(0, 8)}-${n}`,
      createdAt: toISO(d),
      status: "completed",
      planId: DEFAULT_PLAN_ID,
      planLabel: DEFAULT_PLAN_NAME,
      summary: `KumiBox #${n + 1}`,
    });
    d = addMonths(d, 1);
    n += 1;
  }
  orders.reverse();

  return {
    subscription: {
      planId: DEFAULT_PLAN_ID,
      planName: DEFAULT_PLAN_NAME,
      status: "active",
      startedAt,
      nextRenewalAt,
    },
    orders,
    notificationPreferences: {
      orderUpdates: true,
      subscriptionChanges: true,
      productNews: true,
    },
  };
}

