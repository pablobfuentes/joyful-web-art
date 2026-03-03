import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { registryListToArray } from "@/lib/utils";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { FloatingDoodle, DoodleHeart, DoodleSparkle, DoodleLeaf, DoodleDroplet } from "./Doodles";

const emojis = ["📬", "🎯", "📖", "🔄"];

const ExperienceSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("experience");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="relative py-24 px-6 bg-[hsl(var(--experience-section-bg))] overflow-hidden">
      <div className="absolute inset-0 bg-pattern-dots opacity-40" />

      <FloatingDoodle className="top-16 left-[8%] w-11 h-11 text-primary/25" delay={0}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-20 right-[6%] w-10 h-10 text-secondary/20" delay={1}>
        <DoodleSparkle className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-[45%] right-[3%] w-9 h-9 text-accent/30" delay={2}>
        <DoodleLeaf className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-[35%] left-[4%] w-8 h-8 text-primary/15" delay={0.5}>
        <DoodleDroplet className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block bg-peach px-4 py-1 rounded-full text-sm font-bold mb-4 shadow-playful"
            style={getStyleForPath("experience.subtitle", "--foreground")}
            animate={{ rotate: [2, -2, 2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌟 {data.subtitle}
          </motion.span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6" style={getStyleForPath("experience.title", "--foreground")}>
            {data.title}
          </h2>
          <motion.a
            href={data.ctaButton.href}
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block gradient-warm px-10 py-5 rounded-full text-lg font-bold text-primary-foreground shadow-playful hover:shadow-card-hover transition-shadow"
            style={getStyleForPath("experience.ctaButton.label", "--primary-foreground")}
          >
            {data.ctaButton.label} ✨
          </motion.a>
        </motion.div>

        {/* Timeline layout instead of grid */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-primary/20 rounded-full md:-translate-x-1/2" />

          {registryListToArray(data.steps).map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={(step as any)?.number ?? index}
                initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className={`relative flex items-start gap-6 mb-12 md:mb-16 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                } flex-row`}
              >
                {/* Connector dot */}
                <motion.div
                  className="absolute left-6 md:left-1/2 w-14 h-14 gradient-warm rounded-full flex items-center justify-center text-primary-foreground font-display text-xl font-bold shadow-playful border-4 border-background z-10 -translate-x-1/2"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {(step as any).number}
                </motion.div>

                {/* Spacer for the dot */}
                <div className="w-14 shrink-0 md:hidden" />

                {/* Card */}
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`flex-1 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12"} pl-6 md:pl-0`}
                  style={{ maxWidth: "calc(50% - 2rem)" }}
                >
                  <div
                    className="relative p-6 shadow-playful border-4 border-background overflow-visible transition-shadow hover:shadow-card-hover"
                    style={{
                      backgroundColor: "hsl(var(--experience-card-" + index + "-bg))",
                      borderRadius: isEven ? "2rem 0.5rem 2rem 0.5rem" : "0.5rem 2rem 0.5rem 2rem",
                    }}
                  >
                    {/* Emoji */}
                    <motion.span
                      className="absolute -top-3 text-3xl drop-shadow-lg z-10"
                      style={{ [isEven ? "left" : "right"]: "-0.5rem" }}
                      animate={{ y: [0, -6, 0], rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {emojis[index]}
                    </motion.span>

                    <h3 className="font-display text-xl font-bold mb-2" style={getStyleForPath(`experience.steps.${index}.title`, "--foreground")}>
                      {(step as any).title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={getStyleForPath(`experience.steps.${index}.description`, "--muted-foreground")}>
                      {(step as any).description}
                    </p>
                  </div>
                </motion.div>

                {/* Invisible spacer for the other side */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
