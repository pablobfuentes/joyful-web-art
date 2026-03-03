import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { registryListToArray } from "@/lib/utils";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { FloatingDoodle, DoodleDroplet, DoodleLeaf, DoodleFlower, DoodleSparkle } from "./Doodles";

const emojis = ["🧴", "💧", "🛡️", "☀️", "🌸"];

const WhatYouReceiveSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("whatYouReceive");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const products = registryListToArray(data.products);

  return (
    <section className="relative py-24 px-6 bg-[hsl(var(--whatYouReceive-section-bg))] overflow-hidden">
      <FloatingDoodle className="top-16 left-[6%] w-10 h-10 text-primary/25" delay={0}>
        <DoodleDroplet className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-24 right-[8%] w-12 h-12 text-accent/20" delay={1.5}>
        <DoodleLeaf className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-[40%] right-[4%] w-8 h-8 text-secondary/30" delay={0.5}>
        <DoodleFlower className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-40 left-[12%] w-7 h-7 text-primary/20" delay={2}>
        <DoodleSparkle className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block bg-sunshine px-4 py-1 rounded-full text-sm font-bold mb-4 shadow-playful"
            style={getStyleForPath("whatYouReceive.subtitle", "--foreground")}
            animate={{ rotate: [2, -2, 2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {data.subtitleBadgeEmoji ?? "📦"} {data.subtitle}
          </motion.span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4" style={getStyleForPath("whatYouReceive.title", "--foreground")}>
            {data.title}
          </h2>
          <p className="max-w-2xl mx-auto text-lg" style={getStyleForPath("whatYouReceive.description", "--muted-foreground")}>
            {data.description}
          </p>
        </motion.div>

        {/* Accordion strips — each row expands on click to reveal details */}
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {products.map((product, index) => {
            const isOpen = expandedIndex === index;
            return (
              <motion.div
                key={product?.number ?? index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={() => setExpandedIndex(isOpen ? null : index)}
                className="cursor-pointer group"
              >
                <motion.div
                  className="relative border-4 border-background shadow-playful overflow-hidden transition-shadow hover:shadow-card-hover"
                  style={{
                    backgroundColor: `hsl(var(--whatYouReceive-card-${index}-bg))`,
                    borderRadius: "2rem",
                  }}
                  layout
                >
                  {/* Header strip */}
                  <div className="flex items-center gap-4 px-6 py-5">
                    <motion.div
                      className="w-12 h-12 gradient-warm rounded-full flex items-center justify-center text-primary-foreground font-display text-lg font-bold shadow-playful shrink-0"
                      animate={{ rotate: isOpen ? 360 : 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {product.number}
                    </motion.div>

                    <h3
                      className="font-display text-xl font-bold flex-1"
                      style={getStyleForPath(`whatYouReceive.products.${index}.category`, "--foreground")}
                    >
                      {product.category}
                    </h3>

                    <motion.span
                      className="text-3xl"
                      animate={{ y: [0, -4, 0], rotate: isOpen ? [0, -10, 10, 0] : 0 }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {emojis[index % emojis.length]}
                    </motion.span>

                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className="text-2xl select-none"
                    >
                      ▾
                    </motion.div>
                  </div>

                  {/* Expandable content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div className="h-px bg-foreground/10 mb-4" />
                          <p
                            className="text-base leading-relaxed"
                            style={getStyleForPath(`whatYouReceive.products.${index}.description`, "--muted-foreground")}
                          >
                            {product.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatYouReceiveSection;
