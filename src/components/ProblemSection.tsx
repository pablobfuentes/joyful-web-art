import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import problem1 from "@/assets/problem-1.jpg";
import problem2 from "@/assets/problem-2.jpg";
import problem3 from "@/assets/problem-3.jpg";
import { resolveRegistryImageSrc } from "@/lib/registry-images";
import { FloatingDoodle, DoodleDroplet, DoodleSparkle, DoodleHeart } from "./Doodles";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useStyleRegistry } from "@/contexts/StyleRegistryContext";

const FALLBACK_IMAGES = [problem1, problem2, problem3];
const CARD_META = [
  { emoji: "😵‍💫" },
  { emoji: "💸" },
  { emoji: "😴" },
];

const ProblemCard = ({
  card,
  imageSrc,
  style,
  index,
}: {
  card: { beforeText: string; frictionText: string; costText: string };
  imageSrc: string;
  style: (typeof CARD_META)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const rotations = [-3, 2, -2];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotate: rotations[index] * 2 }}
      animate={isInView ? { opacity: 1, y: 0, rotate: rotations[index] } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      whileHover={{ y: -12, rotate: 0, scale: 1.03 }}
      className="group relative"
    >
      <div
        className="rounded-3xl overflow-hidden shadow-playful border-2 border-background transition-shadow duration-500 hover:shadow-card-hover"
        style={{ backgroundColor: "hsl(var(--why-card-" + index + "-bg))" }}
      >
        <div className="relative h-52 overflow-visible">
          <img
            src={imageSrc}
            alt={card.beforeText}
            className="w-full h-full object-cover rounded-t-3xl"
          />
          <motion.div
            className="absolute -bottom-6 right-4 text-5xl drop-shadow-lg"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            {style.emoji}
          </motion.div>
        </div>

        <div className="p-6 pt-8">
          <span
            className="inline-block font-display text-5xl font-bold opacity-25 leading-none mb-1"
            style={{ color: "hsl(var(--why-card-" + index + "-accent))" }}
          >
            0{index + 1}
          </span>
          <h3 className="font-display text-xl font-bold mb-2 text-foreground">
            {card.beforeText}
          </h3>
          <p className="text-muted-foreground text-sm mb-2">{card.frictionText}</p>
          <p className="text-muted-foreground/90 text-sm leading-relaxed font-medium">
            {card.costText}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const ProblemSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const { registry } = useStyleRegistry();
  const data = getSectionContent("why");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const cards = Array.isArray(data.cards) ? data.cards : Object.values(data.cards ?? {});
  const cardStyles = CARD_META.map((meta, i) => ({
    ...meta,
    imageSrc: resolveRegistryImageSrc(registry.why?.images?.[i]?.path, FALLBACK_IMAGES[i]),
  }));

  return (
    <section id="why" className="relative py-24 px-6 bg-pattern-dots bg-[hsl(var(--why-section-bg))] overflow-hidden">
      {/* Scattered doodles */}
      <FloatingDoodle className="top-16 right-[10%] w-8 h-8 text-secondary/30" delay={0}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-20 left-[8%] w-10 h-10 text-primary/20" delay={1.5}>
        <DoodleSparkle className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-[50%] right-[5%] w-7 h-7 text-accent/25" delay={2}>
        <DoodleDroplet className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-4"
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4" style={getStyleForPath("why.title")}>
            {data.title}
          </h2>
          <p className="font-display text-2xl md:text-3xl text-muted-foreground italic mb-2" style={getStyleForPath("why.impactLine1")}>
            {data.impactLine1}
          </p>
          <p className="font-display text-2xl md:text-3xl text-muted-foreground italic" style={getStyleForPath("why.impactLine2")}>
            {data.impactLine2}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {cards.map((card, index) => (
            <ProblemCard key={index} card={card} imageSrc={cardStyles[index].imageSrc} style={CARD_META[index]} index={index} />
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
            href="#compatibility"
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block gradient-warm px-10 py-5 rounded-full text-lg font-bold text-primary-foreground shadow-playful hover:shadow-card-hover transition-shadow"
            style={getStyleForPath("why.ctaButton")}
          >
            {data.ctaButton}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
