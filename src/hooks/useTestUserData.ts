import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  buildTestUserData,
  type TestUserData,
} from "@/lib/test-user-data";

/**
 * Returns test/demo data for the current user (subscription, orders, notification prefs).
 * Subscription starts at user's registration date; orders are generated monthly from then.
 * When not logged in, returns null.
 */
export function useTestUserData(): TestUserData | null {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user?.id || !user?.created_at) return null;
    return buildTestUserData(user.id, user.created_at);
  }, [user?.id, user?.created_at]);
}
