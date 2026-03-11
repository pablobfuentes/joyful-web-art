import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useTestUserData } from "@/hooks/useTestUserData";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function NotificationsPage() {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("notifications");
  const testData = useTestUserData();
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [subscriptionChanges, setSubscriptionChanges] = useState(true);
  const [productNews, setProductNews] = useState(true);

  useEffect(() => {
    if (testData?.notificationPreferences) {
      setOrderUpdates(testData.notificationPreferences.orderUpdates);
      setSubscriptionChanges(testData.notificationPreferences.subscriptionChanges);
      setProductNews(testData.notificationPreferences.productNews);
    }
  }, [testData?.notificationPreferences]);

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

          <div className="mt-6 rounded-lg border border-input bg-card p-4 space-y-4">
            <p className="text-sm text-muted-foreground">{data.body}</p>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor="notif-orders" className="font-medium">
                    {data.orderUpdatesLabel}
                  </Label>
                  <p className="text-sm text-muted-foreground">{data.orderUpdatesDesc}</p>
                </div>
                <Switch
                  id="notif-orders"
                  checked={orderUpdates}
                  onCheckedChange={setOrderUpdates}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor="notif-subscription" className="font-medium">
                    {data.subscriptionChangesLabel}
                  </Label>
                  <p className="text-sm text-muted-foreground">{data.subscriptionChangesDesc}</p>
                </div>
                <Switch
                  id="notif-subscription"
                  checked={subscriptionChanges}
                  onCheckedChange={setSubscriptionChanges}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor="notif-product" className="font-medium">
                    {data.productNewsLabel}
                  </Label>
                  <p className="text-sm text-muted-foreground">{data.productNewsDesc}</p>
                </div>
                <Switch
                  id="notif-product"
                  checked={productNews}
                  onCheckedChange={setProductNews}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

