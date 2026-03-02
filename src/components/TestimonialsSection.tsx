import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { FloatingDoodle, DoodleStar, DoodleHeart, DoodleSparkle } from "./Doodles";

const emojis = ["💖", "🌟", "✨"];
const rotations = [-2, 3, -3];

const TestimonialsSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("testimonials");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-6 bg-[hsl(var(--testimonials-section-bg))] overflow-hidden">

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
            className="inline-block bg-bubblegum px-4 py-1 rounded-full text-sm font-bold mb-4 shadow-playful"
            style={getStyleForPath("testimonials.subtitle", "--foreground")}
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
              <div
                className="rounded-3xl p-7 shadow-playful border-4 border-background relative overflow-visible transition-shadow hover:shadow-card-hover"
                style={{ backgroundColor: "hsl(var(--testimonials-card-" + index + "-bg))" }}
              >
                <motion.span
                  className="absolute -top-4 -right-3 text-3xl drop-shadow-lg"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
                >
                  {emojis[index]}
                </motion.span>

                <div className="text-4xl mb-4 opacity-20 font-display">"</div>
                <p className="italic mb-4 text-sm leading-relaxed" style={getStyleForPath(`testimonials.items.${index}.quote`, "--foreground")}>
                  {item.quote}
                </p>
                <p className="font-display font-bold" style={getStyleForPath(`testimonials.items.${index}.author`, "--primary")}>
                  — {item.author}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
