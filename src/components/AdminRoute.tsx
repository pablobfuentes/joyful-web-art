import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

/**
 * Protects admin-only routes (e.g. RegistryEditor).
 * Requires authenticated user and profiles.role = 'admin'.
 * See docs/supabase_phase1_profiles_orders_rls.sql for profile/role setup.
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { profile, isAdmin, loading: profileLoading, error: profileError } = useProfile();
  const location = useLocation();

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-pulse font-display text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (profileError) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="max-w-lg rounded-2xl border border-destructive/30 bg-destructive/5 p-6 font-display">
          <h2 className="text-xl font-bold text-foreground mb-2">Could not verify admin access</h2>
          <p className="text-muted-foreground text-sm mb-3">
            The request to load your profile failed. A 500 error usually means the{" "}
            <code className="rounded bg-muted px-1">profiles</code> table is missing or its setup
            does not match the app (e.g. column names or RLS).
          </p>
          <p className="text-destructive text-sm mb-4 font-mono">
            {profileError.message}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Run the SQL in <strong>docs/supabase_phase1_profiles_orders_rls.sql</strong> to create{" "}
            <code className="rounded bg-muted px-1">public.profiles</code> with columns{" "}
            <code className="rounded bg-muted px-1">user_id, role, full_name, avatar_url</code> and
            RLS. Then set your user’s <code className="rounded bg-muted px-1">role</code> to{" "}
            <code className="rounded bg-muted px-1">admin</code>. See{" "}
            <strong>docs/ADMIN_REGISTRY_EDITOR.md</strong> for details.
          </p>
          <Link
            to="/"
            className="text-sm font-semibold text-primary underline hover:no-underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    const reason = profile === null
      ? "No profile row found for your account. Add a row in Supabase public.profiles with your user_id and role = 'admin'."
      : `Your profile role is "${profile.role}", not admin. Set role to 'admin' in Supabase Table Editor → profiles.`;
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="max-w-lg rounded-2xl border border-muted bg-muted/30 p-6 font-display">
          <h2 className="text-xl font-bold text-foreground mb-2">Admin access required</h2>
          <p className="text-muted-foreground text-sm mb-4">{reason}</p>
          <Link
            to="/"
            className="text-sm font-semibold text-primary underline hover:no-underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
