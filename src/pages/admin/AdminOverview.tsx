import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, AlertCircle, Clock, Calendar } from "lucide-react";

async function fetchAdminKpis() {
  const [
    { count: activeSubscriptions },
    { count: upcomingShipments },
    { count: failedPayments },
    { count: pendingFulfillment },
    { count: delayedShipments },
  ] = await Promise.all([
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .not("next_shipping_at", "is", null)
      .gte("next_shipping_at", new Date().toISOString())
      .lte("next_shipping_at", new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("payment_status_for_next_shipment", "failed"),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .in("order_status", ["pending", "paid", "packing"]),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .not("shipped_at", "is", null)
      .is("delivered_at", null)
      .lt("shipped_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  return {
    activeSubscriptions: activeSubscriptions ?? 0,
    upcomingShipments: upcomingShipments ?? 0,
    failedPayments: failedPayments ?? 0,
    pendingFulfillment: pendingFulfillment ?? 0,
    delayedShipments: delayedShipments ?? 0,
  };
}

/**
 * Admin overview: KPI cards from Supabase (subscriptions + orders).
 */
export default function AdminOverview() {
  const { data: kpis, isLoading, error } = useQuery({
    queryKey: ["admin-kpis"],
    queryFn: fetchAdminKpis,
    staleTime: 60 * 1000,
  });

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold">Overview</h1>
        <p className="text-destructive">
          Failed to load KPIs. Ensure the Phase 2 migration has been run (subscriptions, orders with order_status). {String((error as Error).message)}
        </p>
      </div>
    );
  }

  const cards = kpis
    ? [
        { title: "Active subscriptions", value: kpis.activeSubscriptions, icon: Package },
        { title: "Upcoming shipments (14d)", value: kpis.upcomingShipments, icon: Calendar },
        { title: "Failed payments", value: kpis.failedPayments, icon: AlertCircle },
        { title: "Orders pending fulfillment", value: kpis.pendingFulfillment, icon: Clock },
        { title: "Delayed shipments", value: kpis.delayedShipments, icon: Truck },
      ]
    : [];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Overview</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Loading KPIs…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cards.map(({ title, value, icon: Icon }) => (
            <Card key={title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
