import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { registryListToArray } from "@/lib/utils";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { FloatingDoodle, DoodleFlower, DoodleStar, DoodleHeart } from "./Doodles";

const emojis = ["💦", "✨", "🧬", "🫧", "☀️", "💧", "🌿", "🍂"];

const PastEditionsSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("pastEditions");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-6 bg-[hsl(var(--pastEditions-section-bg))] overflow-hidden">
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

      <div className="container mx-auto relative z-10">
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
          <h2 className="font-display text-4xl md:text-6xl font-bold" style={getStyleForPath("pastEditions.title", "--foreground")}>
            {data.title}
          </h2>
        </motion.div>

        {/* Horizontal scrollable pill-shaped cards */}
        <div className="flex flex-wrap justify-center gap-5 max-w-5xl mx-auto">
          {registryListToArray(data.editions).map((edition, index) => (
            <motion.div
              key={(edition as any)?.name ?? index}
              initial={{ opacity: 0, scale: 0.7, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, type: "spring", stiffness: 200 }}
              whileHover={{ y: -10, scale: 1.1 }}
              className="group relative"
            >
              {/* Pill / capsule shape */}
              <div
                className="relative px-6 py-5 shadow-playful border-4 border-background text-center overflow-visible transition-shadow hover:shadow-card-hover"
                style={{
                  backgroundColor: "hsl(var(--pastEditions-card-" + (index % 4) + "-bg))",
                  borderRadius: index % 2 === 0 ? "9999px" : "1rem 3rem 1rem 3rem",
                  minWidth: "10rem",
                }}
              >
                <motion.span
                  className="absolute -top-3 -right-2 text-2xl drop-shadow-md z-10"
                  animate={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {emojis[index]}
                </motion.span>
                <h3 className="font-display font-bold text-lg" style={getStyleForPath(`pastEditions.editions.${index}.name`, "--foreground")}>
                  {(edition as any).name}
                </h3>
                <p className="text-sm font-medium" style={getStyleForPath(`pastEditions.editions.${index}.category`, "--muted-foreground")}>
                  {(edition as any).category}
                </p>
                <p className="text-xs mt-1 font-bold" style={getStyleForPath(`pastEditions.editions.${index}.month`, "--muted-foreground")}>
                  {(edition as any).month}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PastEditionsSection;
