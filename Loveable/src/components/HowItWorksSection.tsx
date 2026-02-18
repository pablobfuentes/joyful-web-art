import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import step1 from "@/assets/step-1.jpg";
import step2 from "@/assets/step-2.jpg";
import step3 from "@/assets/step-3.jpg";
import step4 from "@/assets/step-4.jpg";

const steps = [
  {
    num: "01",
    title: "Elige tu ritual",
    desc: "Cuéntanos sobre tu piel, tu estilo de vida y lo que buscas. En dos minutos tienes tu perfil listo y tu primera caja en camino.",
    image: step1,
    emoji: "📱",
  },
  {
    num: "02",
    title: "Seleccionamos para ti",
    desc: "Nuestro equipo en Seúl elige productos que realmente funcionan juntos. No hay relleno, no hay marcas que pagaron por estar ahí.",
    image: step2,
    emoji: "🎁",
  },
  {
    num: "03",
    title: "Llega a tu puerta",
    desc: "Cada mes, una caja con todo lo que necesitas. Incluye una guía personalizada con el orden exacto y los tiempos de aplicación.",
    image: step3,
    emoji: "🚪",
  },
  {
    num: "04",
    title: "Disfruta el ritual",
    desc: "Cinco minutos. Mañana y noche. Sin pensarlo. Tu piel lo nota desde la primera semana.",
    image: step4,
    emoji: "✨",
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
      initial={{ opacity: 0, x: isEven ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
      className={`flex flex-col md:flex-row items-center gap-8 ${
        !isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      <motion.div
        whileHover={{ scale: 1.03, rotate: isEven ? 1 : -1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 w-full"
      >
        <div className="relative rounded-2xl overflow-hidden shadow-card">
          <img
            src={step.image}
            alt={step.title}
            className="w-full h-72 object-cover"
          />
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-lg w-10 h-10 rounded-full flex items-center justify-center font-bold">
            {step.emoji}
          </div>
        </div>
      </motion.div>

      <div className="flex-1 w-full">
        <span className="text-gradient font-display text-6xl font-bold opacity-30">
          {step.num}
        </span>
        <h3 className="font-display text-2xl font-semibold mt-2 mb-3 text-foreground">
          {step.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
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
    <section id="how-it-works" className="py-24 px-6 gradient-soft">
      <div className="container mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-widest text-primary font-semibold mb-3">
            Cómo funciona
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Cuatro pasos.
          </h2>
          <p className="font-display text-2xl md:text-3xl text-muted-foreground italic">
            Cero complicaciones.
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
          <p className="text-muted-foreground mb-6">
            Sin letra pequeña. Sin permanencia. Solo skincare que funciona.
          </p>
          <motion.a
            href="#subscribe"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block gradient-warm px-8 py-4 rounded-full text-base font-semibold text-primary-foreground shadow-soft hover:shadow-card-hover transition-shadow"
          >
            Empieza Ahora 🌸
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
