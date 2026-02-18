import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { APP_REGISTRY } from "@/config/app-registry";
import { FloatingDoodle, DoodleFlower, DoodleStar, DoodleHeart } from "./Doodles";

const data = APP_REGISTRY.pastEditions;
const accentClasses = ["bg-peach", "bg-lavender", "bg-mint", "bg-sunshine"];
const emojis = ["💦", "✨", "🧬", "🫧", "☀️", "💧", "🌿", "🍂"];
const rotations = [-3, 2, -2, 3, -1, 2, -3, 1];

const PastEditionsSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-6 bg-background overflow-hidden">
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
            className="inline-block bg-mint px-4 py-1 rounded-full text-sm font-bold text-foreground mb-4 shadow-playful"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📚 {data.subtitle}
          </motion.span>
          <h2 className="font-display text-4xl md:text-6xl font-bold">{data.title}</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {data.editions.map((edition, index) => (
            <motion.div
              key={edition.name}
              initial={{ opacity: 0, scale: 0.8, rotate: rotations[index] * 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: rotations[index] }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, type: "spring", stiffness: 200 }}
              whileHover={{ y: -10, rotate: 0, scale: 1.08 }}
              className="group relative"
            >
              <div className={`${accentClasses[index % accentClasses.length]} rounded-3xl p-5 shadow-playful border-4 border-background text-center relative overflow-visible transition-shadow hover:shadow-card-hover`}>
                <motion.span
                  className="absolute -top-3 -right-2 text-2xl drop-shadow-md"
                  animate={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {emojis[index]}
                </motion.span>
                <h3 className="font-display font-bold text-foreground text-lg">{edition.name}</h3>
                <p className="text-sm text-muted-foreground font-medium">{edition.category}</p>
                <p className="text-xs text-foreground/60 mt-1 font-bold">{edition.month}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PastEditionsSection;
