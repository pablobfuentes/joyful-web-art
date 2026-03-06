import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useTestUserData } from "@/hooks/useTestUserData";
import { Button } from "@/components/ui/button";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function SubscriptionManagement() {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("subscriptionManagement");
  const testData = useTestUserData();
  const sub = testData?.subscription;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              aria-label="Back to dashboard"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ←
            </Link>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {data.title}
            </h1>
          </div>
          <p className="mt-2 text-muted-foreground">{data.subtitle}</p>

          <div className="mt-6 space-y-4">
            {sub && (
              <div className="rounded-lg border border-input bg-card p-4 space-y-3">
                <p className="text-sm text-muted-foreground">{data.currentPlanLabel}</p>
                <p className="font-semibold">{sub.planName}</p>
                <p className="text-sm text-muted-foreground">{data.planStartedLabel}</p>
                <p className="text-sm">{formatDate(sub.startedAt)}</p>
                <p className="text-sm text-muted-foreground pt-2">{data.nextRenewalLabel}</p>
                <p className="text-sm">{formatDate(sub.nextRenewalAt)}</p>
              </div>
            )}
            <div className="rounded-lg border border-input bg-card p-4 space-y-2">
              <p className="text-sm text-muted-foreground">{data.body}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" size="sm" disabled>
                  {data.pausePlan}
                </Button>
                <Button variant="outline" size="sm" disabled>
                  {data.cancelPlan}
                </Button>
                <Button variant="outline" size="sm" disabled>
                  {data.changePlan}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


