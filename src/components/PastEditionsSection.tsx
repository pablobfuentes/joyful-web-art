import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { APP_REGISTRY } from "@/config/app-registry";
import { FloatingDoodle, DoodleFlower, DoodleStar } from "./Doodles";

const data = APP_REGISTRY.pastEditions;
const accentClasses = ["bg-peach", "bg-lavender", "bg-mint", "bg-sunshine"];

const PastEditionsSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-6 bg-peach/20 overflow-hidden">
      <FloatingDoodle className="top-32 right-[5%] w-8 h-8 text-primary/25" delay={0}>
        <DoodleFlower className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-24 left-[8%] w-7 h-7 text-secondary/25" delay={1}>
        <DoodleStar className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-primary mb-2">{data.subtitle}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">{data.title}</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {data.editions.map((edition, index) => (
            <motion.div
              key={edition.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className={`${accentClasses[index % accentClasses.length]} rounded-2xl p-4 shadow-playful border-2 border-background text-center`}
            >
              <h3 className="font-display font-bold text-foreground">{edition.name}</h3>
              <p className="text-sm text-muted-foreground">{edition.category}</p>
              <p className="text-xs text-foreground/70 mt-1">{edition.month}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PastEditionsSection;
