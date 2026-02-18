import { Link, useNavigate } from "react-router-dom";
import { APP_REGISTRY } from "@/config/app-registry";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const data = APP_REGISTRY.dashboard;

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

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const name = user?.user_metadata?.full_name as string | undefined;
  const email = user?.email ?? "";
  const memberSince = user?.created_at;

  async function handleLogOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {data.welcomeTitle}
          </h1>
          <div className="mt-6 rounded-lg border border-input bg-card p-4 space-y-2">
            <p>
              <span className="text-muted-foreground">{data.emailLabel}:</span> {email}
            </p>
            <p>
              <span className="text-muted-foreground">{data.nameLabel}:</span>{" "}
              {name || "—"}
            </p>
            <p>
              <span className="text-muted-foreground">{data.memberSinceLabel}:</span>{" "}
              {formatDate(memberSince)}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-input bg-card p-4">
              <p className="text-sm text-muted-foreground">{data.subscriptionLabel}</p>
              <p className="font-semibold">{data.subscriptionActive}</p>
            </div>
            <div className="rounded-lg border border-input bg-card p-4">
              <p className="text-sm text-muted-foreground">{data.nextBoxLabel}</p>
              <p className="font-semibold">—</p>
            </div>
          </div>
          <section className="mt-8">
            <h2 className="font-display text-lg font-semibold">{data.accountInfoTitle}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {data.emailLabel}: {email}
            </p>
          </section>
          <section className="mt-8">
            <h2 className="font-display text-lg font-semibold">{data.quickActionsTitle}</h2>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="#" className="text-primary hover:underline">
                  {data.orderHistoryTitle}
                </Link>
                <span className="text-muted-foreground text-sm block">
                  {data.orderHistoryDesc}
                </span>
              </li>
              <li>
                <Link to="#" className="text-primary hover:underline">
                  {data.subscriptionActionTitle}
                </Link>
                <span className="text-muted-foreground text-sm block">
                  {data.subscriptionActionDesc}
                </span>
              </li>
              <li>
                <Link to="#" className="text-primary hover:underline">
                  {data.settingsTitle}
                </Link>
                <span className="text-muted-foreground text-sm block">
                  {data.settingsDesc}
                </span>
              </li>
              <li>
                <Link to="#" className="text-primary hover:underline">
                  {data.notificationsTitle}
                </Link>
                <span className="text-muted-foreground text-sm block">
                  {data.notificationsDesc}
                </span>
              </li>
            </ul>
          </section>
          <div className="mt-10 flex gap-4">
            <Button variant="outline" onClick={handleLogOut}>
              {data.logOut}
            </Button>
            <Button asChild variant="secondary">
              <Link to="/">{data.backToHome}</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
