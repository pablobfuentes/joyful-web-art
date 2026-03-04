import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { registryListToArray } from "@/lib/utils";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { FloatingDoodle, DoodleDroplet, DoodleLeaf, DoodleFlower, DoodleSparkle } from "./Doodles";

const PRODUCT_EMOJIS = ["🧴", "💧", "🛡️", "☀️", "🌸"];

const WhatYouReceiveSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("whatYouReceive");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const products = registryListToArray(data.products) as Array<{
    number?: string;
    category?: string;
    description?: string;
    emoji?: string;
  }>;

  return (
    <section className="relative py-24 px-6 bg-[hsl(var(--whatYouReceive-section-bg))] overflow-visible">
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

        {/* 5 cards in 2 rows (3 + 2), all text visible */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible">
          {products.map((product, index) => (
            <motion.div
              key={product?.number ?? index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-24px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="relative border-4 border-background shadow-playful rounded-2xl overflow-visible transition-shadow hover:shadow-card-hover"
              style={{
                backgroundColor: `hsl(var(--whatYouReceive-card-${index}-bg))`,
              }}
            >
              {/* Number circle: center at card top-left corner, half extending out (wrapper keeps position when motion animates rotate) */}
              <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-10">
                <motion.div
                  className="w-12 h-12 gradient-warm rounded-full flex items-center justify-center text-primary-foreground font-display text-lg font-bold shadow-playful"
                  animate={{ rotate: [0, -4, 4, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.8, delay: index * 0.15 }}
                >
                  {product?.number ?? index + 1}
                </motion.div>
              </div>
              <div className="p-6 pl-10 pt-10">
                <div className="flex items-center gap-3 mb-4">
                  <h3
                    className="font-display text-xl font-bold flex-1"
                    style={getStyleForPath(`whatYouReceive.products.${index}.category`, "--foreground")}
                  >
                    {product?.category}
                  </h3>
                  <motion.span
                    className="text-3xl inline-block"
                    aria-hidden
                    animate={{ rotate: [0, -6, 6, -6, 0], y: [0, -2, 2, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5, delay: index * 0.2 }}
                  >
                    {product?.emoji ?? PRODUCT_EMOJIS[index % PRODUCT_EMOJIS.length]}
                  </motion.span>
                </div>
                <p
                  className="text-base leading-relaxed"
                  style={getStyleForPath(`whatYouReceive.products.${index}.description`, "--muted-foreground")}
                >
                  {product?.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouReceiveSection;
