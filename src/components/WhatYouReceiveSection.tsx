import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { APP_REGISTRY } from "@/config/app-registry";
import { FloatingDoodle, DoodleDroplet, DoodleLeaf } from "./Doodles";

const data = APP_REGISTRY.whatYouReceive;
const bgClasses = ["bg-peach", "bg-lavender", "bg-mint", "bg-sunshine", "bg-peach-strong/80"];

const WhatYouReceiveSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-6 bg-background overflow-hidden">
      <FloatingDoodle className="top-24 left-[8%] w-8 h-8 text-primary/20" delay={0}>
        <DoodleDroplet className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-40 right-[10%] w-9 h-9 text-accent/20" delay={1.5}>
        <DoodleLeaf className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary mb-2">{data.subtitle}</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">{data.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{data.description}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {data.products.map((product, index) => (
            <motion.div
              key={product.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`${bgClasses[index]} rounded-3xl p-6 shadow-playful border-2 border-background`}
            >
              <span className="font-display text-4xl font-bold opacity-30 block mb-2">
                {product.number}
              </span>
              <h3 className="font-display text-xl font-bold mb-2">{product.category}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouReceiveSection;
