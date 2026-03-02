import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { FloatingDoodle, DoodleHeart, DoodleSparkle, DoodleStar, DoodleFlower, DoodleDroplet } from "./Doodles";

const FinalCTASection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("finalCta");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-32 px-6 bg-[hsl(var(--finalCta-section-bg))] overflow-hidden">

      <FloatingDoodle className="top-16 left-[8%] w-12 h-12 text-primary/25" delay={0}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-20 right-[10%] w-10 h-10 text-secondary/30" delay={0.5}>
        <DoodleSparkle className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-24 left-[15%] w-9 h-9 text-accent/25" delay={1}>
        <DoodleStar className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-16 right-[6%] w-11 h-11 text-primary/20" delay={1.5}>
        <DoodleFlower className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-[50%] left-[3%] w-8 h-8 text-accent/15" delay={2}>
        <DoodleDroplet className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10 text-center max-w-2xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className="inline-block text-6xl mb-6"
            animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            🌸
          </motion.span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4" style={getStyleForPath("finalCta.title", "--foreground")}>
            {data.title}
          </h2>
          <p className="text-xl mb-2 font-medium" style={getStyleForPath("finalCta.descriptionPrimary", "--foreground")}>
            {data.descriptionPrimary}
          </p>
          <p className="text-lg mb-10" style={getStyleForPath("finalCta.descriptionSecondary", "--foreground")}>
            {data.descriptionSecondary}
          </p>
          <motion.a
            href={data.ctaButton.href}
            whileHover={{ scale: 1.1, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block gradient-warm px-12 py-6 rounded-full text-xl font-bold text-primary-foreground shadow-playful hover:shadow-card-hover transition-shadow"
            style={getStyleForPath("finalCta.ctaButton.label", "--primary-foreground")}
          >
            {data.ctaButton.label} ✨
          </motion.a>
          <p className="text-sm mt-8 font-medium" style={getStyleForPath("finalCta.footer", "--foreground")}>
            {data.footer}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
