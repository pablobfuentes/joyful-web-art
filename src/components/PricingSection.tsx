import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { APP_REGISTRY } from "@/config/app-registry";
import { FloatingDoodle, DoodleHeart, DoodleFlower, DoodleStar, DoodleSparkle } from "./Doodles";

const data = APP_REGISTRY.pricing;

const PricingSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="relative py-24 px-6 bg-peach-strong overflow-hidden">
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

      <div className="container mx-auto relative z-10 max-w-2xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <motion.span
            className="inline-block bg-sunshine px-4 py-1 rounded-full text-sm font-bold text-foreground mb-4 shadow-playful"
            animate={{ rotate: [2, -2, 2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💰 {data.subtitle}
          </motion.span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">{data.title}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.02 }}
          className="bg-background rounded-3xl p-8 md:p-12 shadow-playful border-4 border-peach relative overflow-visible"
        >
          {/* Floating emojis */}
          <motion.span
            className="absolute -top-5 -right-4 text-4xl"
            animate={{ y: [0, -8, 0], rotate: [0, 15, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            🎁
          </motion.span>
          <motion.span
            className="absolute -bottom-4 -left-4 text-3xl"
            animate={{ y: [0, -6, 0], rotate: [0, -15, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            🌸
          </motion.span>

          <div className="flex items-baseline justify-center gap-2 mb-8">
            <motion.span
              className="font-display text-6xl md:text-7xl font-bold text-gradient"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {data.priceAmount}
            </motion.span>
            <span className="text-xl text-muted-foreground font-bold">{data.pricePeriod}</span>
          </div>

          <ul className="space-y-4 mb-8">
            {data.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-foreground text-lg"
              >
                <span className="w-8 h-8 gradient-warm rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold shadow-playful shrink-0">
                  ✓
                </span>
                {feature}
              </motion.li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-6 justify-center text-sm mb-8">
            <span className="bg-mint px-4 py-2 rounded-full font-bold shadow-playful">
              {data.shippingLabel}: {data.shippingValue} 🚚
            </span>
            <span className="bg-lavender px-4 py-2 rounded-full font-bold shadow-playful">
              {data.commitmentLabel}: {data.commitmentValue} 🎉
            </span>
          </div>

          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="block w-full text-center gradient-warm py-5 rounded-full text-lg font-bold text-primary-foreground shadow-playful hover:shadow-card-hover transition-shadow"
          >
            {data.ctaButton} ✨
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
