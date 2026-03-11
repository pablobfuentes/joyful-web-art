import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";

export default function Login() {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    setSubmitting(false);
    if (err) {
      setError(data.errorGeneric);
      return;
    }
    navigate(redirectTo.startsWith("/") ? redirectTo : "/", { replace: true });
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
              <Label htmlFor="login-email">{data.emailLabel}</Label>
              <Input
                id="login-email"
                type="email"
                placeholder={data.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="login-password">{data.passwordLabel}</Label>
              <Input
                id="login-password"
                type="password"
                placeholder={data.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="mt-1"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="rounded border-input" />
                {data.rememberMe}
              </label>
              <Link
                to={data.forgotPasswordHref}
                className="text-sm text-primary hover:underline"
              >
                {data.forgotPassword}
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? data.submitLoading : data.submitButton}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {data.noAccountText}{" "}
            <Link to={data.signUpHref} className="text-primary font-medium hover:underline">
              {data.signUpLink}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
