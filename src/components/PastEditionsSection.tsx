import { motion, useInView, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";
import { registryListToArray } from "@/lib/utils";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { FloatingDoodle, DoodleFlower, DoodleStar, DoodleHeart } from "./Doodles";

const emojis = ["💦", "✨", "🧬", "🫧", "☀️", "💧", "🌿", "🍂"];

const PastEditionsSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("pastEditions");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const carouselRef = useRef<HTMLDivElement>(null);

  const editions = registryListToArray(data.editions);

  return (
    <section className="relative py-24 bg-[hsl(var(--pastEditions-section-bg))] overflow-hidden">
      <div className="absolute inset-0 bg-pattern-dots opacity-30" />

      <FloatingDoodle className="top-20 right-[6%] w-10 h-10 text-primary/25" delay={0}>
        <DoodleFlower className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-16 left-[5%] w-9 h-9 text-secondary/25" delay={1}>
        <DoodleStar className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-[50%] left-[3%] w-8 h-8 text-accent/20" delay={2}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10 px-6">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <motion.span
            className="inline-block bg-mint px-4 py-1 rounded-full text-sm font-bold mb-4 shadow-playful"
            style={getStyleForPath("pastEditions.subtitle", "--foreground")}
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📚 {data.subtitle}
          </motion.span>
          <h2
            className="font-display text-4xl md:text-6xl font-bold"
            style={getStyleForPath("pastEditions.title", "--foreground")}
          >
            {data.title}
          </h2>
        </motion.div>
      </div>

      {/* Full-width horizontal drag carousel */}
      <motion.div
        ref={carouselRef}
        className="flex gap-6 cursor-grab active:cursor-grabbing px-8 md:px-16 pb-4"
        drag="x"
        dragConstraints={carouselRef}
        dragElastic={0.15}
        style={{ width: "max-content" }}
      >
        {editions.map((edition, index) => (
          <motion.div
            key={(edition as any)?.name ?? index}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07, type: "spring", stiffness: 180 }}
            whileHover={{ y: -16, scale: 1.08, rotate: 3 }}
            className="relative shrink-0"
            style={{ width: "16rem" }}
          >
            {/* Tall card with strong visual hierarchy */}
            <div
              className="relative h-56 flex flex-col justify-end p-5 shadow-playful border-4 border-background overflow-visible transition-shadow hover:shadow-card-hover"
              style={{
                backgroundColor: `hsl(var(--pastEditions-card-${index % 4}-bg))`,
                borderRadius: "1.5rem 3rem 1.5rem 3rem",
              }}
            >
              {/* Large emoji as visual focal point */}
              <motion.span
                className="absolute -top-5 left-1/2 -translate-x-1/2 text-5xl drop-shadow-lg z-10"
                animate={{ y: [0, -8, 0], rotate: [0, -12, 12, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.25 }}
              >
                {emojis[index % emojis.length]}
              </motion.span>

              {/* Month as a ribbon at top */}
              <motion.div
                className="absolute top-4 -right-3 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold shadow-playful z-10"
                style={{ borderRadius: "9999px 0 0 9999px" }}
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {(edition as any).month}
              </motion.div>

              <div className="mt-auto">
                <h3
                  className="font-display font-bold text-2xl mb-1"
                  style={getStyleForPath(`pastEditions.editions.${index}.name`, "--foreground")}
                >
                  {(edition as any).name}
                </h3>
                <p
                  className="text-sm font-medium opacity-80"
                  style={getStyleForPath(`pastEditions.editions.${index}.category`, "--muted-foreground")}
                >
                  {(edition as any).category}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Drag hint */}
      <motion.p
        className="text-center mt-6 text-sm font-bold opacity-50"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ← Desliza para ver más →
      </motion.p>
    </section>
  );
};

export default PastEditionsSection;
