import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { registryListToArray } from "@/lib/utils";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { FloatingDoodle, DoodleStar, DoodleHeart, DoodleSparkle } from "./Doodles";

const emojis = ["💖", "🌟", "✨"];

const TestimonialsSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("testimonials");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  const items = registryListToArray(data.items);
  // Double for seamless infinite loop
  const doubled = [...items, ...items];

  return (
    <section className="relative py-24 bg-[hsl(var(--testimonials-section-bg))] overflow-hidden">
      <FloatingDoodle className="top-20 right-[10%] w-10 h-10 text-primary/25" delay={0}>
        <DoodleStar className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-24 left-[6%] w-9 h-9 text-secondary/30" delay={1}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-[50%] left-[4%] w-8 h-8 text-accent/20" delay={2}>
        <DoodleSparkle className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10 px-6">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block bg-bubblegum px-4 py-1 rounded-full text-sm font-bold mb-4 shadow-playful"
            style={getStyleForPath("testimonials.subtitle", "--foreground")}
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ⭐ {data.subtitle}
          </motion.span>
        </motion.div>
      </div>

      {/* Infinite horizontal marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Fade masks on edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-20 bg-gradient-to-r from-[hsl(var(--testimonials-section-bg))] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-20 bg-gradient-to-l from-[hsl(var(--testimonials-section-bg))] to-transparent" />

        <motion.div
          className="flex gap-8 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {doubled.map((item, index) => {
            const realIndex = index % items.length;
            return (
              <div
                key={index}
                className="shrink-0 w-80 md:w-96"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  className="relative p-8 shadow-playful border-4 border-background overflow-visible"
                  style={{
                    backgroundColor: `hsl(var(--testimonials-card-${realIndex}-bg))`,
                    borderRadius: "2.5rem 1rem 2.5rem 1rem",
                  }}
                >
                  {/* Large quote mark */}
                  <span className="absolute -top-6 -left-2 text-7xl font-display opacity-15 leading-none select-none">"</span>

                  <motion.span
                    className="absolute -top-4 -right-3 text-3xl drop-shadow-lg z-10"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: realIndex * 0.3 }}
                  >
                    {emojis[realIndex]}
                  </motion.span>

                  <p
                    className="italic text-base leading-relaxed mb-6"
                    style={getStyleForPath(`testimonials.items.${realIndex}.quote`, "--foreground")}
                  >
                    {(item as any).quote}
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center text-primary-foreground font-bold text-sm shadow-playful"
                    >
                      {((item as any).author as string)?.charAt(0)}
                    </div>
                    <p
                      className="font-display font-bold"
                      style={getStyleForPath(`testimonials.items.${realIndex}.author`, "--primary")}
                    >
                      {(item as any).author}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
