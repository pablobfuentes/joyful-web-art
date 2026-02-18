import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { APP_REGISTRY } from "@/config/app-registry";
import { FloatingDoodle, DoodleStar, DoodleHeart, DoodleSparkle } from "./Doodles";

const data = APP_REGISTRY.testimonials;
const bgClasses = ["bg-peach", "bg-lavender", "bg-mint"];
const emojis = ["💖", "🌟", "✨"];
const rotations = [-2, 3, -3];

const TestimonialsSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-6 bg-sunshine overflow-hidden">
      <div className="absolute inset-0 bg-pattern-skincare opacity-50" />

      <FloatingDoodle className="top-20 right-[10%] w-10 h-10 text-primary/25" delay={0}>
        <DoodleStar className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-24 left-[6%] w-9 h-9 text-secondary/30" delay={1}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-[50%] left-[4%] w-8 h-8 text-accent/20" delay={2}>
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
            className="inline-block bg-bubblegum px-4 py-1 rounded-full text-sm font-bold text-foreground mb-4 shadow-playful"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ⭐ {data.subtitle}
          </motion.span>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {data.items.map((item, index) => (
            <motion.div
              key={item.author}
              initial={{ opacity: 0, y: 60, rotate: rotations[index] * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: rotations[index] }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              whileHover={{ y: -10, rotate: 0, scale: 1.05 }}
              className="group relative"
            >
              <div className={`${bgClasses[index]} rounded-3xl p-7 shadow-playful border-4 border-background relative overflow-visible transition-shadow hover:shadow-card-hover`}>
                <motion.span
                  className="absolute -top-4 -right-3 text-3xl drop-shadow-lg"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
                >
                  {emojis[index]}
                </motion.span>

                <div className="text-4xl mb-4 opacity-20 font-display">"</div>
                <p className="text-foreground italic mb-4 text-sm leading-relaxed">{item.quote}</p>
                <p className="font-display font-bold text-primary">— {item.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
