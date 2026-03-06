import { Link } from "react-router-dom";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

function formatDate(iso: string | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function Account() {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("account");
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name as string | undefined;
  const email = user?.email ?? "";
  const memberSince = user?.created_at;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {data.title}
          </h1>
          <p className="mt-2 text-muted-foreground">{data.subtitle}</p>

          <div className="mt-6 rounded-lg border border-input bg-card p-4 space-y-4">
            <h2 className="font-display text-lg font-semibold">
              {data.profileTitle}
            </h2>
            <p className="text-sm text-muted-foreground">{data.profileDesc}</p>
            <div className="space-y-2">
              <p>
                <span className="text-muted-foreground">{data.emailLabel}:</span>{" "}
                {email}
              </p>
              <p>
                <span className="text-muted-foreground">{data.nameLabel}:</span>{" "}
                {name || "—"}
              </p>
              <p>
                <span className="text-muted-foreground">
                  {data.memberSinceLabel}:
                </span>{" "}
                {formatDate(memberSince)}
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to={data.editProfileHref}>{data.editProfileLabel}</Link>
            </Button>
          </div>

          <div className="mt-6 rounded-lg border border-input bg-card p-4 space-y-4">
            <h2 className="font-display text-lg font-semibold">
              {data.securityTitle}
            </h2>
            <p className="text-sm text-muted-foreground">{data.securityDesc}</p>
            <Button asChild variant="outline" size="sm">
              <Link to={data.changePasswordHref}>
                {data.changePasswordLabel}
              </Link>
            </Button>
          </div>

          <div className="mt-6 rounded-lg border border-input bg-card p-4 space-y-4">
            <h2 className="font-display text-lg font-semibold">
              {data.preferencesTitle}
            </h2>
            <p className="text-sm text-muted-foreground">
              {data.preferencesDesc}
            </p>
          </div>

          <div className="mt-10">
            <Button asChild variant="secondary">
              <Link to={data.backToDashboardHref}>{data.backToDashboard}</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
