import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function Dashboard() {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("dashboard");
  const { user, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const name = user?.user_metadata?.full_name as string | undefined;
  const email = user?.email ?? "";
  const memberSince = user?.created_at;

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(name ?? "");
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  async function handleLogOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  function startEditing() {
    setEditName(name ?? "");
    setProfileError(null);
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setProfileError(null);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setSaving(true);
    const { error } = await updateProfile(editName.trim());
    setSaving(false);
    if (error) {
      setProfileError(data.profileUpdateError);
      return;
    }
    toast.success(data.profileUpdatedSuccess);
    setEditing(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {data.welcomeTitle}
          </h1>

          <div className="mt-6 rounded-lg border border-input bg-card p-4 space-y-4">
            <h2 className="font-display text-lg font-semibold">{data.accountInfoTitle}</h2>
            {editing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {profileError && (
                  <p className="text-sm text-destructive">{profileError}</p>
                )}
                <div>
                  <Label htmlFor="profile-name">{data.profileNameLabel}</Label>
                  <Input
                    id="profile-name"
                    type="text"
                    placeholder={data.profileNamePlaceholder}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoComplete="name"
                    className="mt-1"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {data.emailLabel}: {email}
                </p>
                <div className="flex gap-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? data.saveProfileLoading : data.saveProfile}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelEditing}>
                    {data.cancelEdit}
                  </Button>
                </div>
              </form>
            ) : (
              <>
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
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={startEditing}>
                    {data.editProfileButton}
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={data.changePasswordHref}>{data.changePasswordLabel}</Link>
                  </Button>
                </div>
              </>
            )}
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
