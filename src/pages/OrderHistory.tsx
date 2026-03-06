import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { useRegistryContent } from "@/contexts/RegistryContentContext";

export default function OrderHistory() {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("orderHistory");

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

          <div className="mt-6 rounded-lg border border-input bg-card p-4 space-y-2">
            <h2 className="font-display text-lg font-semibold">
              {data.emptyStateTitle}
            </h2>
            <p className="text-sm text-muted-foreground">
              {data.emptyStateDescription}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}


