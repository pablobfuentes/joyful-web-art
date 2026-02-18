import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { APP_REGISTRY } from "@/config/app-registry";
import { FloatingDoodle, DoodleHeart, DoodleSparkle } from "./Doodles";

const data = APP_REGISTRY.experience;
const bgClasses = ["bg-peach", "bg-lavender", "bg-mint", "bg-sunshine"];

const ExperienceSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="relative py-24 px-6 bg-background overflow-hidden">
      <FloatingDoodle className="top-20 left-[10%] w-9 h-9 text-primary/20" delay={0}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-28 right-[8%] w-8 h-8 text-secondary/20" delay={1}>
        <DoodleSparkle className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary mb-2">{data.subtitle}</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">{data.title}</h2>
          <motion.a
            href={data.ctaButton.href}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block gradient-warm px-8 py-4 rounded-full font-bold text-primary-foreground shadow-playful"
          >
            {data.ctaButton.label}
          </motion.a>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {data.steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${bgClasses[index]} rounded-3xl p-6 shadow-playful border-2 border-background`}
            >
              <span className="font-display text-5xl font-bold opacity-25 block mb-2">
                {step.number}
              </span>
              <h3 className="font-display text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
