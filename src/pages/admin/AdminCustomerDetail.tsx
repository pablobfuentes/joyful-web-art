import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
  } catch {
    return "—";
  }
}

async function fetchCustomerDetail(userId: string) {
  const [
    { data: profile, error: e0 },
    { data: listRow, error: eList },
    { data: subscriptions, error: e1 },
    { data: orders, error: e2 },
    { data: notes, error: e3 },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("admin_customers_list").select("customer_email").eq("user_id", userId).maybeSingle(),
    supabase.from("subscriptions").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("orders").select("*, order_items(*)").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("admin_notes").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
  ]);

  if (e0 || eList || e1 || e2 || e3) throw e0 || eList || e1 || e2 || e3;
  const customerEmail = (listRow as { customer_email?: string } | null)?.customer_email ?? null;

  const orderIds = (orders ?? []).map((o: { id: string }) => o.id);
  const subIds = (subscriptions ?? []).map((s: { id: string }) => s.id);
  const noteIds = (notes ?? []).map((n: { id: string }) => n.id);

  const auditParts: Array<{ entity_type: string; entity_id: string; action: string; old_value: unknown; new_value: unknown; changed_by: string; changed_at: string }> = [];
  if (orderIds.length) {
    const { data: orderLogs } = await supabase.from("audit_logs").select("*").eq("entity_type", "order").in("entity_id", orderIds);
    if (orderLogs) auditParts.push(...orderLogs);
  }
  if (subIds.length) {
    const { data: subLogs } = await supabase.from("audit_logs").select("*").eq("entity_type", "subscription").in("entity_id", subIds);
    if (subLogs) auditParts.push(...subLogs);
  }
  if (noteIds.length) {
    const { data: noteLogs } = await supabase.from("audit_logs").select("*").eq("entity_type", "admin_note").in("entity_id", noteIds);
    if (noteLogs) auditParts.push(...noteLogs);
  }
  const auditLogs = auditParts.sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime());

  const nextOrder = (orders ?? []).find(
    (o: { order_status: string | null }) => o.order_status && !["shipped", "delivered", "cancelled"].includes(o.order_status)
  );
  const shippedOrders = (orders ?? []).filter((o: { shipped_at: string | null }) => o.shipped_at);

  return {
    profile: profile ?? null,
    customerEmail,
    subscriptions: subscriptions ?? [],
    orders: orders ?? [],
    adminNotes: notes ?? [],
    auditLogs,
    nextOrder: nextOrder ?? null,
    shippedOrders,
  };
}

/**
 * Customer detail: tabs for Profile, Subscription, Next Order, Order History, Shipment History, Notes, Audit Log.
 * Edit modals (UI-5) to be added for subscription/order/notes.
 */
const SUB_STATUSES = ["active", "paused", "pending", "canceled", "trial", "past_due"];
const ORDER_STATUSES = ["pending", "paid", "packing", "shipped", "delivered", "delayed", "issue", "cancelled"];

export default function AdminCustomerDetail() {
  const { userId } = useParams<{ userId: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [subModalOpen, setSubModalOpen] = useState(false);
  const [subId, setSubId] = useState("");
  const [subStatus, setSubStatus] = useState("");
  const [subSaving, setSubSaving] = useState(false);

  const [orderStatusModalOpen, setOrderStatusModalOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [orderStatusSaving, setOrderStatusSaving] = useState(false);

  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippedAt, setShippedAt] = useState("");
  const [trackingSaving, setTrackingSaving] = useState(false);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteBody, setNoteBody] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-customer", userId],
    queryFn: () => fetchCustomerDetail(userId!),
    enabled: !!userId,
  });

  async function handleUpdateSubStatus() {
    if (!subId || !subStatus) return;
    setSubSaving(true);
    const { error: e } = await supabase.from("subscriptions").update({ status: subStatus, updated_at: new Date().toISOString() }).eq("id", subId);
    setSubSaving(false);
    if (e) {
      toast.error(e.message);
      return;
    }
    toast.success("Subscription status updated");
    setSubModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["admin-customer", userId] });
  }

  async function handleUpdateOrderStatus() {
    if (!orderId || !orderStatus) return;
    setOrderStatusSaving(true);
    const { error: e } = await supabase.from("orders").update({ order_status: orderStatus, updated_at: new Date().toISOString() }).eq("id", orderId);
    setOrderStatusSaving(false);
    if (e) {
      toast.error(e.message);
      return;
    }
    toast.success("Order status updated");
    setOrderStatusModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["admin-customer", userId] });
  }

  async function handleAddTracking() {
    if (!trackOrderId || !trackingNumber.trim()) return;
    setTrackingSaving(true);
    const payload: Record<string, unknown> = { tracking_number: trackingNumber.trim(), carrier: carrier.trim() || null, updated_at: new Date().toISOString() };
    if (shippedAt) payload.shipped_at = new Date(shippedAt).toISOString();
    const { error: e } = await supabase.from("orders").update(payload).eq("id", trackOrderId);
    setTrackingSaving(false);
    if (e) {
      toast.error(e.message);
      return;
    }
    toast.success("Tracking added");
    setTrackingModalOpen(false);
    setCarrier("");
    setTrackingNumber("");
    setShippedAt("");
    queryClient.invalidateQueries({ queryKey: ["admin-customer", userId] });
  }

  async function handleAddNote() {
    if (!noteBody.trim() || !user?.id) return;
    setNoteSaving(true);
    const { error: e } = await supabase.from("admin_notes").insert({ user_id: userId, body: noteBody.trim(), created_by: user.id });
    setNoteSaving(false);
    if (e) {
      toast.error(e.message);
      return;
    }
    toast.success("Note added");
    setNoteModalOpen(false);
    setNoteBody("");
    queryClient.invalidateQueries({ queryKey: ["admin-customer", userId] });
  }

  if (!userId) {
    return (
      <div className="space-y-6">
        <Link to="/admin/customers" className="text-sm text-muted-foreground hover:text-foreground">← Customers</Link>
        <p className="text-destructive">Missing customer ID.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link to="/admin/customers" className="text-sm text-muted-foreground hover:text-foreground">← Customers</Link>
        <p className="text-destructive">Failed to load customer. {String((error as Error).message)}</p>
      </div>
    );
  }

  const p = data?.profile as Record<string, unknown> | null;
  const customerEmail = data?.customerEmail as string | null;
  const subs = (data?.subscriptions ?? []) as Array<Record<string, unknown>>;
  const orders = (data?.orders ?? []) as Array<Record<string, unknown> & { order_items?: Array<Record<string, unknown>> }>;
  const notes = (data?.adminNotes ?? []) as Array<Record<string, unknown>>;
  const auditLogs = (data?.auditLogs ?? []) as Array<Record<string, unknown>>;
  const nextOrder = data?.nextOrder as Record<string, unknown> & { order_items?: Array<Record<string, unknown>> } | null;
  const shippedOrders = (data?.shippedOrders ?? []) as Array<Record<string, unknown>>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/customers" className="text-sm text-muted-foreground hover:text-foreground">← Customers</Link>
      </div>
      <h1 className="font-display text-2xl font-bold">
        {p ? String(p.full_name ?? "Customer") : "Customer"} <span className="text-muted-foreground font-normal text-base">({userId})</span>
      </h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="flex flex-wrap gap-1">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="next_order">Next Order</TabsTrigger>
            <TabsTrigger value="order_history">Order History</TabsTrigger>
            <TabsTrigger value="shipment_history">Shipment History</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Name:</strong> {p ? String(p.full_name ?? "—") : "—"}</p>
                <p><strong>Email:</strong> {customerEmail ?? "—"}</p>
                <p><strong>Phone:</strong> {p ? String(p.phone ?? "—") : "—"}</p>
                <p><strong>Address:</strong> {p ? [p.address_line, p.city, p.state, p.postal_code, p.country].filter(Boolean).join(", ") || "—" : "—"}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Subscription(s)</CardTitle>
                {subs.length > 0 && (
                  <Dialog open={subModalOpen} onOpenChange={setSubModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Update status</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Update subscription status</DialogTitle></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Subscription</Label>
                          <Select value={subId} onValueChange={setSubId}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              {subs.map((s) => (
                                <SelectItem key={String(s.id)} value={String(s.id)}>{String(s.plan_id)} ({String(s.status)})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>New status</Label>
                          <Select value={subStatus} onValueChange={setSubStatus}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              {SUB_STATUSES.map((v) => (
                                <SelectItem key={v} value={v}>{v}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSubModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateSubStatus} disabled={subSaving || !subId || !subStatus}>{subSaving ? "Saving…" : "Save"}</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent>
                {subs.length === 0 ? (
                  <p className="text-muted-foreground">No subscription.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {subs.map((s) => (
                      <li key={String(s.id)} className="border-b pb-2">
                        Plan: {String(s.plan_id)} · Status: {String(s.status)} · Next shipping: {formatDate(s.next_shipping_at as string)} · Payment (next): {String(s.payment_status_for_next_shipment ?? "—")}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="next_order" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Next Order</CardTitle>
                {orders.length > 0 && (
                  <div className="flex gap-2">
                    <Dialog open={orderStatusModalOpen} onOpenChange={setOrderStatusModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Update order status</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Update order status</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label>Order</Label>
                            <Select value={orderId} onValueChange={setOrderId}>
                              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent>
                                {orders.map((o) => (
                                  <SelectItem key={String(o.id)} value={String(o.id)}>{formatDate(o.created_at as string)} · {String(o.order_status ?? o.status)}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>New order status</Label>
                            <Select value={orderStatus} onValueChange={setOrderStatus}>
                              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent>
                                {ORDER_STATUSES.map((v) => (
                                  <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setOrderStatusModalOpen(false)}>Cancel</Button>
                          <Button onClick={handleUpdateOrderStatus} disabled={orderStatusSaving || !orderId || !orderStatus}>{orderStatusSaving ? "Saving…" : "Save"}</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={trackingModalOpen} onOpenChange={setTrackingModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Add tracking</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Add tracking</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label>Order</Label>
                            <Select value={trackOrderId} onValueChange={setTrackOrderId}>
                              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent>
                                {orders.map((o) => (
                                  <SelectItem key={String(o.id)} value={String(o.id)}>{formatDate(o.created_at as string)} · {String(o.order_status ?? o.status)}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Carrier</Label>
                            <Input value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="e.g. USPS" />
                          </div>
                          <div>
                            <Label>Tracking number</Label>
                            <Input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Required" />
                          </div>
                          <div>
                            <Label>Shipped at (optional)</Label>
                            <Input type="datetime-local" value={shippedAt} onChange={(e) => setShippedAt(e.target.value)} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setTrackingModalOpen(false)}>Cancel</Button>
                          <Button onClick={handleAddTracking} disabled={trackingSaving || !trackOrderId || !trackingNumber.trim()}>{trackingSaving ? "Saving…" : "Save"}</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {!nextOrder ? (
                  <p className="text-muted-foreground">No pending order.</p>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p>Status: {String(nextOrder.order_status)} · Payment: {String(nextOrder.payment_status ?? "—")}</p>
                    <p>Tracking: {String(nextOrder.tracking_number ?? "—")} {nextOrder.carrier ? `(${nextOrder.carrier})` : ""}</p>
                    {nextOrder.order_items?.length ? (
                      <Table>
                        <TableHeader><TableRow><TableHead>SKU / Name</TableHead><TableHead>Qty</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {(nextOrder.order_items as Array<Record<string, unknown>>).map((item: Record<string, unknown>, i: number) => (
                            <TableRow key={i}><TableCell>{String(item.sku ?? item.product_name_snapshot ?? "—")}</TableCell><TableCell>{Number(item.quantity)}</TableCell></TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="order_history" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Order History</CardTitle></CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground">No orders.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Order status</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((o) => (
                        <TableRow key={String(o.id)}>
                          <TableCell>{formatDate(o.created_at as string)}</TableCell>
                          <TableCell>{String(o.plan_id)}</TableCell>
                          <TableCell>{String(o.order_status ?? o.status ?? "—")}</TableCell>
                          <TableCell>{String(o.payment_status ?? "—")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipment_history" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Shipment History</CardTitle></CardHeader>
              <CardContent>
                {shippedOrders.length === 0 ? (
                  <p className="text-muted-foreground">No shipments yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Shipped</TableHead>
                        <TableHead>Cycle</TableHead>
                        <TableHead>Carrier</TableHead>
                        <TableHead>Tracking</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shippedOrders.map((o) => (
                        <TableRow key={String(o.id)}>
                          <TableCell>{formatDate(o.shipped_at as string)}</TableCell>
                          <TableCell>{String(o.cycle_label ?? "—")}</TableCell>
                          <TableCell>{String(o.carrier ?? "—")}</TableCell>
                          <TableCell>{String(o.tracking_number ?? "—")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Admin Notes</CardTitle>
                <Dialog open={noteModalOpen} onOpenChange={setNoteModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Add note</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add internal note</DialogTitle></DialogHeader>
                    <div className="py-4">
                      <Label>Note</Label>
                      <textarea
                        className="mt-2 w-full min-h-[120px] rounded-md border bg-background px-3 py-2 text-sm"
                        value={noteBody}
                        onChange={(e) => setNoteBody(e.target.value)}
                        placeholder="Internal note about this customer…"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNoteModalOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddNote} disabled={noteSaving || !noteBody.trim() || !user?.id}>{noteSaving ? "Saving…" : "Save"}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {notes.length === 0 ? (
                  <p className="text-muted-foreground">No notes.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {notes.map((n) => (
                      <li key={String(n.id)} className="border-b pb-2">
                        <p>{String(n.body)}</p>
                        <p className="text-muted-foreground">By {String(n.created_by)} at {formatDate(n.created_at as string)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Audit Log</CardTitle></CardHeader>
              <CardContent>
                {auditLogs.length === 0 ? (
                  <p className="text-muted-foreground">No audit entries.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>When</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.slice(0, 50).map((a) => (
                        <TableRow key={String(a.id)}>
                          <TableCell>{formatDate(a.changed_at as string)}</TableCell>
                          <TableCell>{String(a.entity_type)} {String(a.entity_id).slice(0, 8)}…</TableCell>
                          <TableCell>{String(a.action)}</TableCell>
                          <TableCell>{String(a.changed_by).slice(0, 8)}…</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
