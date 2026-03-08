import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { registryListToArray } from "@/lib/utils";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { FloatingDoodle, DoodleHeart, DoodleSparkle, DoodleLeaf, DoodleDroplet } from "./Doodles";

const STEP_EMOJIS = ["📬", "🎯", "📖", "🔄"];

/** Fill fraction (0–1) so the colored line reaches from section top to viewport center. */
function useTimelineFillProgress(sectionRef: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const sectionHeight = rect.height;
      if (sectionHeight <= 0) {
        setProgress(0);
        return;
      }
      const viewportCenterY = window.innerHeight / 2;
      const fillFromTop = viewportCenterY - rect.top;
      const fraction = fillFromTop / sectionHeight;
      setProgress(Math.min(1, Math.max(0, fraction)));
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionRef]);

  return progress;
}

const ExperienceSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("experience");
  const headerRef = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const lineProgress = useTimelineFillProgress(sectionRef);
  const steps = registryListToArray(data.steps) as Array<{ number?: string; title?: string; description?: string }>;

  return (
    <section ref={sectionRef} id="experience" className="relative py-24 px-6 max-md:px-4 bg-[hsl(var(--experience-section-bg))] overflow-hidden">
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
          <p
            className="text-xs font-medium tracking-[0.4em] uppercase text-muted-foreground mb-6"
            style={getStyleForPath("experience.subtitle", "--muted-foreground")}
          >
            {data.subtitle}
          </p>
          <h2
            className="font-display text-4xl md:text-6xl font-bold mb-4"
            style={getStyleForPath("experience.title", "--foreground")}
          >
            {data.title}
          </h2>
          <p
            className="max-w-xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed"
            style={getStyleForPath("experience.topBody", "--muted-foreground")}
          >
            {data.topBody}
          </p>
        </motion.div>

        {/* Timeline layout instead of grid */}
        <div className="relative max-w-3xl mx-auto max-md:px-0">
          <div
            data-testid="experience-vertical-line"
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-primary/20 rounded-full md:-translate-x-1/2 overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="absolute left-0 right-0 top-0 w-full rounded-full bg-primary"
              style={{ height: `${lineProgress * 100}%` }}
            />
          </div>
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            const stepKey = step?.number ?? index;
            return (
              <motion.div
                key={stepKey}
                data-step={index}
                initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className={`relative flex items-start gap-4 md:gap-6 mb-4 md:mb-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}
                style={{ minHeight: "28vh" }}
              >
                <motion.div
                  className="absolute left-4 md:left-1/2 w-14 h-14 gradient-warm rounded-full flex items-center justify-center text-primary-foreground font-display text-xl font-bold shadow-playful border-4 border-background z-10 -translate-x-1/2"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {step?.number ?? index + 1}
                </motion.div>
                <div className="w-14 shrink-0 md:hidden" />
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`flex-1 max-w-full max-md:min-w-[33.33vw] md:max-w-[calc(50%-2rem)] ${isEven ? "md:pr-12 md:text-right" : "md:pl-12"} pl-4 md:pl-0 max-md:pl-4`}
                >
                  <div
                    className="relative p-4 md:p-6 shadow-playful border-4 border-background overflow-visible transition-shadow hover:shadow-card-hover"
                    style={{
                      backgroundColor: `hsl(var(--experience-card-${index}-bg))`,
                      borderRadius: isEven ? "2rem 0.5rem 2rem 0.5rem" : "0.5rem 2rem 0.5rem 2rem",
                    }}
                  >
                    <motion.span
                      className="absolute -top-3 text-3xl drop-shadow-lg z-10"
                      style={{ [isEven ? "left" : "right"]: "-0.5rem" }}
                      animate={{ y: [0, -6, 0], rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {STEP_EMOJIS[index]}
                    </motion.span>
                    <h3 className="font-display text-xl font-bold mb-2" style={getStyleForPath(`experience.steps.${index}.title`, "--foreground")}>
                      {step?.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={getStyleForPath(`experience.steps.${index}.description`, "--muted-foreground")}>
                      {step?.description}
                    </p>
                  </div>
                </motion.div>
                <div className="hidden md:block flex-1" />
              </motion.div>
            );
          })}
        </div>

        {/* Closing section with line, top & bottom paragraphs, and bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 flex flex-col items-center text-center px-4"
        >
          <motion.div
            className="w-16 h-px bg-primary/30 mx-auto mb-6"
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7 }}
          />
          <p
            className="text-xs font-medium tracking-[0.4em] uppercase text-muted-foreground mb-4"
            style={getStyleForPath("experience.closing.overline", "--muted-foreground")}
          >
            {data.closing.overline}
          </p>
          <h3
            className="font-display text-3xl md:text-4xl text-foreground mb-4 leading-tight"
            style={getStyleForPath("experience.closing.title", "--foreground")}
          >
            {data.closing.title}
            <br />
            <span className="text-primary">{data.closing.highlight}</span>
          </h3>
          <p
            className="max-w-md mx-auto text-muted-foreground text-base md:text-lg leading-relaxed mb-8"
            style={getStyleForPath("experience.closing.body", "--muted-foreground")}
          >
            {data.closing.body}
          </p>
          <motion.a
            href={data.closing.ctaHref}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold text-sm tracking-wide uppercase rounded-full shadow-playful hover:shadow-card-hover transition-shadow"
            style={getStyleForPath("experience.closing.ctaLabel", "--primary-foreground")}
          >
            {data.closing.ctaLabel}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
