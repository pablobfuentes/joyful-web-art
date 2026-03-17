import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import Navbar from "@/components/Navbar";
import { FloatingDoodle, DoodleHeart, DoodleSparkle, DoodleStar } from "@/components/Doodles";
import { useAuth } from "@/contexts/AuthContext";
import { createCheckoutSession } from "@/lib/checkout";
import { useUserAddresses } from "@/hooks/useUserAddresses";

const accentBg: Record<string, string> = {
  lavender: "bg-lavender",
  peach: "bg-peach",
  mint: "bg-mint",
};

export default function Checkout() {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("checkout");
  const plans = getSectionContent("pricing").plans;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { defaultAddress } = useUserAddresses();
  const planId = searchParams.get("plan") || "monthly";
  const selectedPlan = plans.find((p) => p.id === planId) || plans[1];

  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", state: "", zip: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGift = selectedPlan.id === "gift";
  const loginRequired = !isGift && !user && !authLoading;

  useEffect(() => {
    if (loginRequired) {
      navigate(`/login?redirect=${encodeURIComponent(`/checkout?plan=${planId}`)}`, { replace: true });
      return;
    }
  }, [loginRequired, navigate, planId]);

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      email: user.email ?? f.email,
      name: (user.user_metadata?.full_name as string) ?? f.name,
    }));
  }, [user]);

  // Prefill address fields from default saved address (if any)
  useEffect(() => {
    if (!defaultAddress) return;
    setForm((f) => ({
      name: f.name || defaultAddress.full_name,
      email: f.email || defaultAddress.email || f.email,
      address:
        f.address ||
        [
          defaultAddress.street,
          defaultAddress.street_number_ext,
          defaultAddress.street_number_int,
        ]
          .filter(Boolean)
          .join(" "),
      city: f.city || defaultAddress.municipio,
      state: f.state || defaultAddress.state,
      zip: f.zip || defaultAddress.postal_code,
    }));
  }, [defaultAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const canSubmit = form.name && form.email && form.address && form.city && form.state && form.zip;

  if (authLoading && !isGift) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando…</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!canSubmit || saving) return;
    setError(null);
    setSaving(true);
    const { url, error: err } = await createCheckoutSession({ planId: selectedPlan.id });
    setSaving(false);
    if (err) {
      setError(err);
      return;
    }
    if (url) window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Pattern + doodles */}
      <div className="absolute inset-0 bg-pattern-skincare opacity-[0.03]" />
      <FloatingDoodle className="top-32 left-[5%] w-10 h-10 text-primary/15" delay={0}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-48 right-[6%] w-8 h-8 text-secondary/20" delay={1.2}>
        <DoodleSparkle className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-24 left-[10%] w-9 h-9 text-accent/15" delay={0.6}>
        <DoodleStar className="w-full h-full" />
      </FloatingDoodle>

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <motion.a
            href="/#pricing"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-muted-foreground hover:text-foreground font-bold mb-6 inline-block transition-colors"
          >
            {data.backLink}
          </motion.a>

          <AnimatePresence mode="wait">
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
                {/* Header */}
                <motion.h1
                  className="font-display text-3xl md:text-5xl font-bold mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {data.title}
                </motion.h1>
                <p className="text-muted-foreground text-lg mb-10">{data.subtitle}</p>

                <div className="grid md:grid-cols-5 gap-8">
                  {/* Form – 3 cols */}
                  <div className="md:col-span-3 space-y-8">
                    {/* Contact */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-background rounded-3xl p-6 shadow-card border-2 border-[hsl(var(--peach))]"
                    >
                      <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                        📧 {data.contactTitle}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-bold text-foreground mb-1 block">{data.nameLabel}</label>
                          <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder={data.namePlaceholder}
                            className="w-full rounded-xl border-2 border-muted px-4 py-3 text-foreground bg-background focus:border-[hsl(var(--primary))] focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-foreground mb-1 block">{data.emailLabel}</label>
                          <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder={data.emailPlaceholder}
                            className="w-full rounded-xl border-2 border-muted px-4 py-3 text-foreground bg-background focus:border-[hsl(var(--primary))] focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Address */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-background rounded-3xl p-6 shadow-card border-2 border-[hsl(var(--lavender))]"
                    >
                      <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                        📦 {data.addressTitle}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-bold text-foreground mb-1 block">{data.addressLabel}</label>
                          <input
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder={data.addressPlaceholder}
                            className="w-full rounded-xl border-2 border-muted px-4 py-3 text-foreground bg-background focus:border-[hsl(var(--primary))] focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-bold text-foreground mb-1 block">{data.cityLabel}</label>
                            <input
                              name="city"
                              value={form.city}
                              onChange={handleChange}
                              placeholder={data.cityPlaceholder}
                              className="w-full rounded-xl border-2 border-muted px-4 py-3 text-foreground bg-background focus:border-[hsl(var(--primary))] focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-bold text-foreground mb-1 block">{data.stateLabel}</label>
                            <input
                              name="state"
                              value={form.state}
                              onChange={handleChange}
                              placeholder={data.statePlaceholder}
                              className="w-full rounded-xl border-2 border-muted px-4 py-3 text-foreground bg-background focus:border-[hsl(var(--primary))] focus:outline-none transition-colors"
                            />
                          </div>
                        </div>
                        <div className="w-1/2">
                          <label className="text-sm font-bold text-foreground mb-1 block">{data.zipLabel}</label>
                          <input
                            name="zip"
                            value={form.zip}
                            onChange={handleChange}
                            placeholder={data.zipPlaceholder}
                            className="w-full rounded-xl border-2 border-muted px-4 py-3 text-foreground bg-background focus:border-[hsl(var(--primary))] focus:outline-none transition-colors"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Dirección actual tomada de tu perfil.{" "}
                          <button
                            type="button"
                            className="underline font-semibold"
                            onClick={() =>
                              navigate(
                                `/settings?from=checkout&plan=${encodeURIComponent(planId)}`
                              )
                            }
                          >
                            Cambiar dirección de envío
                          </button>
                        </p>
                      </div>
                    </motion.div>

                    {/* Submit */}
                    {error && (
                      <p className="text-sm text-destructive font-medium text-center" role="alert">
                        {error}
                      </p>
                    )}
                    <motion.button
                      onClick={handleSubmit}
                      disabled={!canSubmit || saving}
                      whileHover={canSubmit && !saving ? { scale: 1.04, rotate: -1 } : {}}
                      whileTap={canSubmit && !saving ? { scale: 0.96 } : {}}
                      className={`w-full py-5 rounded-full text-lg font-bold shadow-playful transition-all ${canSubmit && !saving ? "gradient-warm text-primary-foreground hover:shadow-card-hover cursor-pointer" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                    >
                      {saving ? data.payButtonSaving : data.payButton}
                    </motion.button>
                    <p className="text-center text-sm text-muted-foreground">{data.secureNote}</p>
                  </div>

                  {/* Order summary – 2 cols */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="md:col-span-2"
                  >
                    <div className={`rounded-3xl p-6 shadow-playful border-4 border-[hsl(var(--${selectedPlan.accentColor === "peach" ? "primary" : selectedPlan.accentColor}))] ${accentBg[selectedPlan.accentColor]} relative overflow-visible`}>
                      {/* Floating emoji */}
                      <motion.span
                        className="absolute -top-4 -right-3 text-3xl"
                        animate={{ y: [0, -6, 0], rotate: [0, 12, -8, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        {selectedPlan.emoji}
                      </motion.span>

                      <h3 className="font-display text-lg font-bold mb-1">{data.orderSummary}</h3>
                      <div className="h-[2px] gradient-warm rounded-full mb-4" />

                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-foreground">{selectedPlan.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                          </div>
                        </div>

                        <ul className="space-y-2">
                          {selectedPlan.features.map((f, i) => (
                            <li key={i} className="text-sm flex items-center gap-2">
                              <span className="text-xs">✓</span> {f}
                            </li>
                          ))}
                        </ul>

                        <div className="h-[2px] bg-foreground/10 rounded-full" />

                        <div className="flex justify-between items-baseline">
                          <span className="font-bold">Total</span>
                          <div className="text-right">
                            <span className="font-display text-3xl font-bold text-gradient">{selectedPlan.priceAmount}</span>
                            <span className="text-sm text-muted-foreground ml-1">{selectedPlan.pricePeriod}</span>
                          </div>
                        </div>
                      </div>

                      {/* Switch plan links */}
                      <div className="mt-6 pt-4 border-t border-foreground/10">
                        <p className="text-xs text-muted-foreground mb-2 font-bold">Cambiar plan:</p>
                        <div className="flex flex-wrap gap-2">
                          {plans
                            .filter((p) => p.id !== selectedPlan.id)
                            .map((p) => (
                              <button
                                key={p.id}
                                onClick={() => navigate(`/checkout?plan=${p.id}`, { replace: true })}
                                className="text-xs bg-background/70 px-3 py-1 rounded-full font-bold hover:bg-background transition-colors"
                              >
                                {p.emoji} {p.name}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
