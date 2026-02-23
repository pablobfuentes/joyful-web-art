import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import step1 from "@/assets/step-1.jpg";
import step2 from "@/assets/step-2.jpg";
import step3 from "@/assets/step-3.jpg";
import step4 from "@/assets/step-4.jpg";
import { resolveRegistryImageSrc } from "@/lib/registry-images";
import { FloatingDoodle, DoodleFlower, DoodleLeaf, DoodleStar, DoodleDroplet } from "./Doodles";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useStyleRegistry } from "@/contexts/StyleRegistryContext";

const FALLBACK_STEP_IMAGES = [step1, step2, step3, step4];
const STEP_META = [
  { emoji: "📱" },
  { emoji: "🎁" },
  { emoji: "🚪" },
  { emoji: "✨" },
];

const StepCard = ({
  step,
  imageSrc,
  style,
  index,
}: {
  step: { label: string; title: string; description: string };
  imageSrc: string;
  style: (typeof STEP_META)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -80 : 80 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
      className={`flex flex-col md:flex-row items-center gap-10 ${
        !isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      <motion.div
        whileHover={{ scale: 1.05, rotate: isEven ? 3 : -3 }}
        transition={{ duration: 0.4 }}
        className="flex-1 w-full flex justify-center"
      >
        <div className="relative">
          <div
            className="w-64 h-64 md:w-72 md:h-72 rounded-full relative overflow-visible shadow-playful"
            style={{ backgroundColor: "hsl(var(--howItWorks-step-card-" + index + "-bg))" }}
          >
            <div className="absolute inset-[-12px] rounded-full overflow-hidden">
              <img
                src={imageSrc}
                alt={step.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <motion.div
            className="absolute -top-3 -right-3 w-16 h-16 gradient-warm rounded-full flex items-center justify-center text-primary-foreground font-display text-2xl font-bold shadow-playful border-4 border-background"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            {index + 1}
          </motion.div>
          <motion.span
            className="absolute -bottom-2 -left-2 text-4xl drop-shadow-md"
            animate={{ y: [0, -6, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            {style.emoji}
          </motion.span>
        </div>
      </motion.div>

      <div className="flex-1 w-full text-center md:text-left">
        <span className="inline-block text-sm font-semibold text-primary mb-2">{step.label}</span>
        <h3 className="font-display text-2xl md:text-3xl font-bold mb-3 text-foreground">
          {step.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-lg">{step.description}</p>
      </div>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const { registry } = useStyleRegistry();
  const data = getSectionContent("howItWorks");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const stepStyles = STEP_META.map((meta, i) => ({
    ...meta,
    imageSrc: resolveRegistryImageSrc(registry.howItWorks?.images?.[i]?.path, FALLBACK_STEP_IMAGES[i]),
  }));

  return (
    <section id="how-it-works" className="relative py-24 px-6 bg-[hsl(var(--howItWorks-section-bg))] overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-pattern-dots opacity-50" />

      {/* Doodles */}
      <FloatingDoodle className="top-20 left-[5%] w-10 h-10 text-primary/20" delay={0}>
        <DoodleFlower className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-[40%] right-[8%] w-8 h-8 text-accent/25" delay={1}>
        <DoodleLeaf className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-32 left-[12%] w-7 h-7 text-secondary/30" delay={2}>
        <DoodleStar className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-[40%] right-[3%] w-9 h-9 text-primary/15" delay={0.5}>
        <DoodleDroplet className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-8" style={getStyleForPath("howItWorks.title")}>
            {data.title}
          </h2>
          <motion.a
            href={data.ctaButton.href}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block gradient-warm px-6 py-3 rounded-full text-sm font-bold text-primary-foreground shadow-playful"
            style={getStyleForPath("howItWorks.ctaButton")}
          >
            {data.ctaButton.label}
          </motion.a>
        </motion.div>

        <div className="space-y-20 max-w-4xl mx-auto">
          {data.steps.map((step, index) => (
            <StepCard key={step.label} step={step} imageSrc={stepStyles[index].imageSrc} style={STEP_META[index]} index={index} />
          ))}
        </div>

        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 40 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mt-20"
        >
          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block gradient-warm px-10 py-5 rounded-full text-lg font-bold text-primary-foreground shadow-playful hover:shadow-card-hover transition-shadow"
          >
            Empieza Ahora 🌸
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
