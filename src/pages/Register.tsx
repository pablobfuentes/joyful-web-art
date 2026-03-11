import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import SocialAuthButtons from "@/components/SocialAuthButtons";

export default function Register() {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [socialSubmitting, setSocialSubmitting] = useState(false);
  const { signUp, signInWithOAuth } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError(data.errorGeneric);
      return;
    }
    setSubmitting(true);
    const { error: err } = await signUp(email, password, name || undefined);
    setSubmitting(false);
    if (err) {
      setError(data.errorGeneric);
      return;
    }
    navigate("/", { replace: true });
  }

  async function handleOAuth(provider: "google" | "facebook") {
    setError(null);
    setSocialSubmitting(true);
    const { error: err } = await signInWithOAuth(provider);
    setSocialSubmitting(false);

    if (err) {
      setError(data.socialErrorGeneric);
    }
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
              <Label htmlFor="register-name">{data.nameLabel}</Label>
              <Input
                id="register-name"
                type="text"
                placeholder={data.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="register-email">{data.emailLabel}</Label>
              <Input
                id="register-email"
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
              <Label htmlFor="register-password">{data.passwordLabel}</Label>
              <Input
                id="register-password"
                type="password"
                placeholder={data.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="register-confirm">{data.confirmPasswordLabel}</Label>
              <Input
                id="register-confirm"
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
          <div className="mt-6">
            <SocialAuthButtons
              dividerText={data.socialDividerText}
              googleLabel={data.googleButton}
              facebookLabel={data.facebookButton}
              showFacebook={false}
              disabled={submitting || socialSubmitting}
              onProviderClick={handleOAuth}
            />
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {data.alreadyHaveAccount}{" "}
            <Link to={data.signInHref} className="text-primary font-medium hover:underline">
              {data.signInLink}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
