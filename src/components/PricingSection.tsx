import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { APP_REGISTRY } from "@/config/app-registry";
import { FloatingDoodle, DoodleHeart } from "./Doodles";

const data = APP_REGISTRY.pricing;

const PricingSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="relative py-24 px-6 bg-background overflow-hidden">
      <FloatingDoodle className="top-40 left-[5%] w-10 h-10 text-primary/15" delay={0}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10 max-w-2xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-primary mb-2">{data.subtitle}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">{data.title}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-peach rounded-3xl p-8 md:p-10 shadow-playful border-2 border-background"
        >
          <div className="flex items-baseline justify-center gap-1 mb-8">
            <span className="font-display text-5xl md:text-6xl font-bold text-foreground">
              {data.priceAmount}
            </span>
            <span className="text-xl text-muted-foreground">{data.pricePeriod}</span>
          </div>
          <ul className="space-y-3 mb-8">
            {data.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-foreground">
                <span className="text-primary">✓</span> {feature}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-6 justify-center text-sm mb-8">
            <span>
              <strong>{data.shippingLabel}:</strong> {data.shippingValue}
            </span>
            <span>
              <strong>{data.commitmentLabel}:</strong> {data.commitmentValue}
            </span>
          </div>
          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="block w-full text-center gradient-warm py-4 rounded-full font-bold text-primary-foreground shadow-playful"
          >
            {data.ctaButton}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
