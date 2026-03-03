import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { registryListToArray } from "@/lib/utils";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { FloatingDoodle, DoodleHeart, DoodleFlower, DoodleStar, DoodleSparkle } from "./Doodles";

const ACCENT_KEYS = ["lavender", "peach", "mint"] as const;

const PricingSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("pricing");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const navigate = useNavigate();

  return (
    <section id="pricing" className="relative py-24 px-6 bg-[hsl(var(--pricing-section-bg))] overflow-hidden">
      <div className="absolute inset-0 bg-pattern-dots opacity-50" />

      <FloatingDoodle className="top-24 left-[5%] w-12 h-12 text-primary/20" delay={0}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-16 right-[8%] w-10 h-10 text-secondary/25" delay={1}>
        <DoodleFlower className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-20 left-[12%] w-8 h-8 text-accent/20" delay={2}>
        <DoodleStar className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-32 right-[4%] w-9 h-9 text-primary/15" delay={0.5}>
        <DoodleSparkle className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10 max-w-6xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block bg-sunshine px-4 py-1 rounded-full text-sm font-bold text-foreground mb-4 shadow-playful"
            animate={{ rotate: [2, -2, 2] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={getStyleForPath("pricing.subtitle", "--foreground")}
          >
            💰 {data.subtitle}
          </motion.span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4" style={getStyleForPath("pricing.title", "--foreground")}>
            {data.title}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {registryListToArray(data.plans).map((plan, index) => {
            const isPopular = !!plan.badge && plan.accentColor === "peach";
            return (
              <motion.div
                key={plan?.id ?? index}
                initial={{ opacity: 0, y: 40, rotate: index === 0 ? -2 : index === 2 ? 2 : 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: index === 0 ? -1 : index === 2 ? 1 : 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 180, delay: index * 0.12 }}
                whileHover={{ scale: 1.04, rotate: 0, y: -8 }}
                className={`relative rounded-3xl p-8 shadow-playful border-4 overflow-visible flex flex-col ${isPopular ? "md:-mt-4 md:mb-[-16px] md:pb-10 ring-4 ring-[hsl(var(--primary)/0.3)]" : ""}`}
                style={{
                  backgroundColor: "hsl(var(--pricing-card-bg))",
                  borderColor: ACCENT_KEYS.includes(plan.accentColor as (typeof ACCENT_KEYS)[number])
                    ? "hsl(var(--pricing-card-border-" + plan.accentColor + "))"
                    : "hsl(var(--border))",
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <motion.span
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sunshine px-4 py-1 rounded-full text-sm font-bold text-foreground shadow-playful whitespace-nowrap z-10"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={getStyleForPath(`pricing.plans.${index}.badge`, "--foreground")}
                  >
                    {plan.badge}
                  </motion.span>
                )}

                {/* Floating emoji */}
                <motion.span
                  className="absolute -top-5 -right-4 text-4xl"
                  animate={{ y: [0, -8, 0], rotate: [0, 15, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
                >
                  {plan.emoji}
                </motion.span>

                {/* Plan name */}
                <h3 className="font-display text-xl font-bold mb-2 mt-2" style={getStyleForPath(`pricing.plans.${index}.name`, "--foreground")}>
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-6" style={getStyleForPath(`pricing.plans.${index}.description`, "--muted-foreground")}>
                  {plan.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <motion.span
                    className="font-display text-5xl font-bold text-gradient"
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200 }}
                    style={getStyleForPath(`pricing.plans.${index}.priceAmount`)}
                  >
                    {plan.priceAmount}
                  </motion.span>
                  <span className="text-lg text-muted-foreground font-bold" style={getStyleForPath(`pricing.plans.${index}.pricePeriod`, "--muted-foreground")}>
                    {plan.pricePeriod}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {registryListToArray(plan.features).map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.08 }}
                      className="flex items-center gap-3 text-foreground"
                      style={getStyleForPath(`pricing.plans.${index}.features.${i}`, "--foreground")}
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-playful shrink-0"
                        style={{
                          backgroundColor: ACCENT_KEYS.includes(plan.accentColor as (typeof ACCENT_KEYS)[number])
                            ? "hsl(var(--pricing-card-border-" + plan.accentColor + "))"
                            : "hsl(var(--muted))",
                        }}
                      >
                        ✓
                      </span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.button
                  onClick={() => navigate(`/checkout?plan=${plan.id}`)}
                  whileHover={{ scale: 1.06, rotate: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full text-center py-4 rounded-full text-lg font-bold shadow-playful hover:shadow-card-hover transition-shadow ${isPopular ? "gradient-warm text-primary-foreground" : "text-foreground border-2"}`}
                  style={{
                    ...(getStyleForPath(`pricing.plans.${index}.ctaButton`) ?? {}),
                    ...(!isPopular
                      ? {
                          backgroundColor: ACCENT_KEYS.includes(plan.accentColor as (typeof ACCENT_KEYS)[number])
                            ? "hsl(var(--pricing-card-border-" + plan.accentColor + "))"
                            : "hsl(var(--muted))",
                          borderColor: ACCENT_KEYS.includes(plan.accentColor as (typeof ACCENT_KEYS)[number])
                            ? "hsl(var(--pricing-card-border-" + plan.accentColor + "))"
                            : "hsl(var(--border))",
                        }
                      : {}),
                  }}
                >
                  {plan.ctaButton} ✨
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-6 justify-center text-sm mt-12"
        >
          <span
            className="px-4 py-2 rounded-full font-bold shadow-playful"
            style={{ ...getStyleForPath("pricing.shippingLabel", "--foreground"), backgroundColor: "hsl(var(--pricing-bottom-badge-0-bg))" }}
          >
            {data.shippingLabel}: <span style={getStyleForPath("pricing.shippingValue", "--foreground")}>{data.shippingValue}</span> 🚚
          </span>
          <span
            className="px-4 py-2 rounded-full font-bold shadow-playful"
            style={{ ...getStyleForPath("pricing.commitmentLabel", "--foreground"), backgroundColor: "hsl(var(--pricing-bottom-badge-1-bg))" }}
          >
            {data.commitmentLabel}: <span style={getStyleForPath("pricing.commitmentValue", "--foreground")}>{data.commitmentValue}</span> 🎉
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
