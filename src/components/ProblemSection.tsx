import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import problem1 from "@/assets/problem-1.jpg";
import problem2 from "@/assets/problem-2.jpg";
import problem3 from "@/assets/problem-3.jpg";
import { FloatingDoodle, DoodleDroplet, DoodleSparkle, DoodleHeart } from "./Doodles";

const problems = [
  {
    num: "01",
    title: "Demasiadas opciones, ninguna respuesta",
    desc: "Abriste una tienda online. Viste 200 serums. Leíste 40 reseñas. Cerraste la pestaña. Repetiste mañana. El mercado del skincare no fue hecho para ayudarte a elegir.",
    image: problem1,
    emoji: "😵‍💫",
    bgClass: "bg-peach",
    accentColor: "text-primary",
  },
  {
    num: "02",
    title: "Dinero gastado, frascos olvidados",
    desc: "Ese serum de 45 euros que prometía todo. Lo usaste dos semanas. No pasó nada. Ahora vive detrás del espejo, junto a los otros tres que tampoco funcionaron.",
    image: problem2,
    emoji: "💸",
    bgClass: "bg-lavender",
    accentColor: "text-secondary",
  },
  {
    num: "03",
    title: "Rutinas que nadie puede mantener",
    desc: "Doble limpieza. Tónico. Esencia. Serum. Ampollas. Crema. Protector solar. A las 11 de la noche, lo último que quieres es un ritual de 12 pasos.",
    image: problem3,
    emoji: "😴",
    bgClass: "bg-mint",
    accentColor: "text-accent",
  },
];

const ProblemCard = ({
  problem,
  index,
}: {
  problem: (typeof problems)[0];
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
      <div className={`${problem.bgClass} rounded-3xl overflow-hidden shadow-playful border-2 border-background transition-shadow duration-500 hover:shadow-card-hover`}>
        {/* Image with overflow emoji */}
        <div className="relative h-52 overflow-visible">
          <img
            src={problem.image}
            alt={problem.title}
            className="w-full h-full object-cover rounded-t-3xl"
          />
          {/* Big emoji overflowing the card */}
          <motion.div
            className="absolute -bottom-6 right-4 text-5xl drop-shadow-lg"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            {problem.emoji}
          </motion.div>
        </div>

        <div className="p-6 pt-8">
          {/* Number badge - bold and overlapping */}
          <span className={`inline-block ${problem.accentColor} font-display text-5xl font-bold opacity-25 leading-none mb-1`}>
            {problem.num}
          </span>
          <h3 className="font-display text-xl font-bold mb-3 text-foreground">
            {problem.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {problem.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const ProblemSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <section id="why" className="relative py-24 px-6 bg-pattern-dots bg-background overflow-hidden">
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
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={headerInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-block bg-secondary text-secondary-foreground px-5 py-2 rounded-full text-sm font-bold mb-5 shadow-playful rotate-[-2deg]"
          >
            💭 Por qué existimos
          </motion.span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-2">
            Conocemos el problema.
          </h2>
          <p className="font-display text-2xl md:text-3xl text-muted-foreground italic">
            Lo vivimos. 😤
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {problems.map((problem, index) => (
            <ProblemCard key={problem.num} problem={problem} index={index} />
          ))}
        </div>

        {/* CTA after problems */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 40 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mt-20"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-2">
            Se acabó buscar. 🎯
          </h2>
          <p className="font-display text-xl text-muted-foreground italic mb-3">
            Empezaste a cuidarte.
          </p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            KumiBox selecciona, tú disfrutas. Cada mes, una rutina completa
            pensada solo para ti.
          </p>
          <motion.a
            href="#subscribe"
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block gradient-warm px-10 py-5 rounded-full text-lg font-bold text-primary-foreground shadow-playful hover:shadow-card-hover transition-shadow"
          >
            Quiero Mi Primera Caja 📦
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
