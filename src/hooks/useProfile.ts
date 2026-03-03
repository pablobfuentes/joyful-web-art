import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export type Profile = {
  user_id: string;
  role: "user" | "admin";
  full_name?: string | null;
  avatar_url?: string | null;
};

export function useProfile(): {
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  error: Error | null;
} {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setError(null);
    setLoading(true);
    (async () => {
      // Ensure Supabase client has current session (fixes "already logged in" case
      // where session was restored from storage and profile request ran before JWT was attached)
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      const uid = session?.user?.id ?? user.id;
      const { data, error: err } = await supabase
        .from("profiles")
        .select("user_id, role")
        .eq("user_id", uid)
        .maybeSingle();
      if (!cancelled) {
        setProfile(err ? null : (data as Profile | null));
        const errMessage =
          err && "code" in err
            ? `${err.message} (code: ${(err as { code?: string }).code})`
            : err
              ? err.message
              : null;
        setError(errMessage ? new Error(errMessage) : null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { profile, loading, isAdmin: profile?.role === "admin", error };
}
