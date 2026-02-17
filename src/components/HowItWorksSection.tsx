import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import step1 from "@/assets/step-1.jpg";
import step2 from "@/assets/step-2.jpg";
import step3 from "@/assets/step-3.jpg";
import step4 from "@/assets/step-4.jpg";
import { FloatingDoodle, DoodleFlower, DoodleLeaf, DoodleStar, DoodleDroplet } from "./Doodles";

const steps = [
  {
    num: "1",
    title: "Elige tu ritual",
    desc: "Cuéntanos sobre tu piel, tu estilo de vida y lo que buscas. En dos minutos tienes tu perfil listo y tu primera caja en camino.",
    image: step1,
    emoji: "📱",
    bgClass: "bg-peach",
  },
  {
    num: "2",
    title: "Seleccionamos para ti",
    desc: "Nuestro equipo en Seúl elige productos que realmente funcionan juntos. No hay relleno, no hay marcas que pagaron por estar ahí.",
    image: step2,
    emoji: "🎁",
    bgClass: "bg-lavender",
  },
  {
    num: "3",
    title: "Llega a tu puerta",
    desc: "Cada mes, una caja con todo lo que necesitas. Incluye una guía personalizada con el orden exacto y los tiempos de aplicación.",
    image: step3,
    emoji: "🚪",
    bgClass: "bg-mint",
  },
  {
    num: "4",
    title: "Disfruta el ritual",
    desc: "Cinco minutos. Mañana y noche. Sin pensarlo. Tu piel lo nota desde la primera semana.",
    image: step4,
    emoji: "✨",
    bgClass: "bg-sunshine",
  },
];

const StepCard = ({
  step,
  index,
}: {
  step: (typeof steps)[0];
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
      {/* Image in a circle-ish blob with overflow */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: isEven ? 3 : -3 }}
        transition={{ duration: 0.4 }}
        className="flex-1 w-full flex justify-center"
      >
        <div className="relative">
          {/* Colored circle background */}
          <div className={`w-64 h-64 md:w-72 md:h-72 rounded-full ${step.bgClass} relative overflow-visible shadow-playful`}>
            {/* Image slightly overflows the circle */}
            <div className="absolute inset-[-12px] rounded-full overflow-hidden">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Number badge overlapping the edge */}
          <motion.div
            className="absolute -top-3 -right-3 w-16 h-16 gradient-warm rounded-full flex items-center justify-center text-primary-foreground font-display text-2xl font-bold shadow-playful border-4 border-background"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            {step.num}
          </motion.div>
          {/* Emoji floating out */}
          <motion.span
            className="absolute -bottom-2 -left-2 text-4xl drop-shadow-md"
            animate={{ y: [0, -6, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            {step.emoji}
          </motion.span>
        </div>
      </motion.div>

      {/* Text side */}
      <div className="flex-1 w-full text-center md:text-left">
        <h3 className="font-display text-2xl md:text-3xl font-bold mb-3 text-foreground">
          {step.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-lg">{step.desc}</p>
      </div>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="relative py-24 px-6 bg-peach-strong overflow-hidden">
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
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={headerInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-block bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-bold mb-5 shadow-playful rotate-[2deg]"
          >
            🪄 Cómo funciona
          </motion.span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-2">
            Cuatro pasos.
          </h2>
          <p className="font-display text-2xl md:text-3xl text-muted-foreground italic">
            Cero complicaciones. 😌
          </p>
        </motion.div>

        <div className="space-y-20 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <StepCard key={step.num} step={step} index={index} />
          ))}
        </div>

        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 40 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mt-20"
        >
          <p className="text-muted-foreground mb-6 text-lg">
            Sin letra pequeña. Sin permanencia. Solo skincare que funciona. ✌️
          </p>
          <motion.a
            href="#subscribe"
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
