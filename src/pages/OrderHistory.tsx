import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useTestUserData } from "@/hooks/useTestUserData";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function statusLabel(
  status: string,
  data: { statusCompleted: string; statusPending: string; statusCancelled: string }
): string {
  switch (status) {
    case "completed":
      return data.statusCompleted;
    case "pending":
      return data.statusPending;
    case "cancelled":
      return data.statusCancelled;
    default:
      return status;
  }
}

export default function OrderHistory() {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("orderHistory");
  const testData = useTestUserData();
  const orders = testData?.orders ?? [];
  const hasOrders = orders.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              aria-label="Volver al panel"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ←
            </Link>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {data.title}
            </h1>
          </div>
          <p className="mt-2 text-muted-foreground">{data.subtitle}</p>

          {hasOrders ? (
            <div className="mt-6 rounded-lg border border-input bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-input bg-muted/50">
                    <th className="text-left font-semibold p-3">{data.orderDateColumn}</th>
                    <th className="text-left font-semibold p-3">{data.orderSummaryColumn}</th>
                    <th className="text-left font-semibold p-3">{data.statusColumn}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-input last:border-0">
                      <td className="p-3 text-muted-foreground">{formatDate(order.createdAt)}</td>
                      <td className="p-3">{order.summary}</td>
                      <td className="p-3">{statusLabel(order.status, data)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-input bg-card p-4 space-y-2">
              <h2 className="font-display text-lg font-semibold">
                {data.emptyStateTitle}
              </h2>
              <p className="text-sm text-muted-foreground">
                {data.emptyStateDescription}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


