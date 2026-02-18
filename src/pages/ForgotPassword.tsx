import { useState } from "react";
import { Link } from "react-router-dom";
import { APP_REGISTRY } from "@/config/app-registry";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";

const data = APP_REGISTRY.forgotPassword;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPasswordForEmail } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await resetPasswordForEmail(email);
    setSubmitting(false);
    if (err) {
      setError(data.errorGeneric);
      return;
    }
    setSent(true);
  }

  if (sent) {
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
              <Link to={data.signInHref}>{data.backToLogin}</Link>
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
              <Label htmlFor="forgot-email">{data.emailLabel}</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder={data.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? data.submitLoading : data.submitButton}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {data.rememberPassword}{" "}
            <Link to={data.signInHref} className="text-primary font-medium hover:underline">
              {data.signInLink}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
