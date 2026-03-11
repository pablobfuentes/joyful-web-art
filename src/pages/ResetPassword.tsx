import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { APP_REGISTRY } from "@/config/app-registry";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";

export default function ResetPassword() {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("resetPassword");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError(data.errorGeneric);
      return;
    }
    setSubmitting(true);
    const { error: err } = await updatePassword(password);
    setSubmitting(false);
    if (err) {
      setError(err.message.includes("link") ? data.errorInvalidLink : data.errorGeneric);
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate(data.backToLoginHref, { replace: true }), 2000);
  }

  if (hasSession === null) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16 flex items-center justify-center">
          <p className="text-muted-foreground">{APP_REGISTRY.status.loading}</p>
        </main>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <p className="text-destructive">{data.errorInvalidLink}</p>
            <Button asChild className="mt-4">
              <Link to={data.backToLoginHref}>{data.backToLogin}</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">
              {data.successTitle}
            </h1>
            <p className="mt-2 text-muted-foreground">{data.successMessage}</p>
            <Button asChild className="mt-6">
              <Link to={data.backToLoginHref}>{data.goToLogin}</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-2xl font-bold text-foreground">{data.title}</h1>
          <p className="mt-1 text-muted-foreground">{data.subtitle}</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 text-destructive text-sm px-3 py-2">
                {data.errorTitle}: {error}
              </div>
            )}
            <div>
              <Label htmlFor="reset-new">{data.newPasswordLabel}</Label>
              <Input
                id="reset-new"
                type="password"
                placeholder={data.newPasswordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="reset-confirm">{data.confirmPasswordLabel}</Label>
              <Input
                id="reset-confirm"
                type="password"
                placeholder={data.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? data.submitLoading : data.submitButton}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to={data.backToLoginHref} className="text-primary font-medium hover:underline">
              {data.backToLogin}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
