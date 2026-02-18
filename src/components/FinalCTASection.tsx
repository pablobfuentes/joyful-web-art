import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { APP_REGISTRY } from "@/config/app-registry";

const data = APP_REGISTRY.finalCta;

const FinalCTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-6 bg-peach-strong overflow-hidden">
      <div className="absolute inset-0 bg-pattern-dots opacity-40" />
      <div className="container mx-auto relative z-10 text-center max-w-2xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">{data.title}</h2>
          <p className="text-xl text-foreground/90 mb-2">{data.descriptionPrimary}</p>
          <p className="text-lg text-foreground/80 mb-8">{data.descriptionSecondary}</p>
          <motion.a
            href={data.ctaButton.href}
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block gradient-warm px-10 py-5 rounded-full text-lg font-bold text-primary-foreground shadow-playful hover:shadow-card-hover transition-shadow"
          >
            {data.ctaButton.label}
          </motion.a>
          <p className="text-sm text-foreground/70 mt-6">{data.footer}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
