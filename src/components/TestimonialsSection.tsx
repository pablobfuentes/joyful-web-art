import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { APP_REGISTRY } from "@/config/app-registry";
import { FloatingDoodle, DoodleStar } from "./Doodles";

const data = APP_REGISTRY.testimonials;
const bgClasses = ["bg-peach/40", "bg-lavender/40", "bg-mint/40"];

const TestimonialsSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-6 bg-peach-strong/30 overflow-hidden">
      <FloatingDoodle className="top-32 right-[12%] w-8 h-8 text-primary/20" delay={0}>
        <DoodleStar className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary">{data.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {data.items.map((item, index) => (
            <motion.div
              key={item.author}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${bgClasses[index]} rounded-3xl p-6 shadow-playful border-2 border-background`}
            >
              <p className="text-foreground italic mb-4">"{item.quote}"</p>
              <p className="font-display font-bold text-foreground">— {item.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
