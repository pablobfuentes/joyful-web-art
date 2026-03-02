import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { FloatingDoodle, DoodleDroplet, DoodleLeaf, DoodleFlower, DoodleSparkle } from "./Doodles";

const rotations = [-3, 2, -2, 3, -1];

const WhatYouReceiveSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("whatYouReceive");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {data.products.map((product, index) => (
            <motion.div
              key={product.number}
              initial={{ opacity: 0, y: 60, rotate: rotations[index] * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: rotations[index] }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -12, rotate: 0, scale: 1.05 }}
              className="group relative"
            >
              <div
                className="rounded-3xl p-6 shadow-playful border-4 border-background relative overflow-visible transition-shadow hover:shadow-card-hover"
                style={{ backgroundColor: "hsl(var(--whatYouReceive-card-" + index + "-bg))" }}
              >
                {/* Number badge overlapping top-left */}
                <motion.div
                  className="absolute -top-4 -left-4 w-14 h-14 gradient-warm rounded-full flex items-center justify-center text-primary-foreground font-display text-xl font-bold shadow-playful border-4 border-background z-10"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {product.number}
                </motion.div>

                {/* Floating emoji */}
                <motion.span
                  className="absolute -top-3 -right-3 text-3xl drop-shadow-lg"
                  animate={{ y: [0, -6, 0], rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
                >
                  {product.emoji ?? ["🧴", "💧", "🛡️", "☀️", "🌸"][index]}
                </motion.span>

                <div className="pt-4">
                  <h3 className="font-display text-xl font-bold mb-2" style={getStyleForPath(`whatYouReceive.products.${index}.category`, "--foreground")}>
                    {product.category}
                  </h3>
                  <p className="text-sm leading-relaxed" style={getStyleForPath(`whatYouReceive.products.${index}.description`, "--muted-foreground")}>
                    {product.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouReceiveSection;
