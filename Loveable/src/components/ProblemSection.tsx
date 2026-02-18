import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import problem1 from "@/assets/problem-1.jpg";
import problem2 from "@/assets/problem-2.jpg";
import problem3 from "@/assets/problem-3.jpg";

const problems = [
  {
    num: "01",
    title: "Demasiadas opciones, ninguna respuesta",
    desc: "Abriste una tienda online. Viste 200 serums. Leíste 40 reseñas. Cerraste la pestaña. Repetiste mañana. El mercado del skincare no fue hecho para ayudarte a elegir.",
    image: problem1,
  },
  {
    num: "02",
    title: "Dinero gastado, frascos olvidados",
    desc: "Ese serum de 45 euros que prometía todo. Lo usaste dos semanas. No pasó nada. Ahora vive detrás del espejo, junto a los otros tres que tampoco funcionaron.",
    image: problem2,
  },
  {
    num: "03",
    title: "Rutinas que nadie puede mantener",
    desc: "Doble limpieza. Tónico. Esencia. Serum. Ampollas. Crema. Protector solar. A las 11 de la noche, lo último que quieres es un ritual de 12 pasos.",
    image: problem3,
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.2, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-500"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={problem.image}
          alt={problem.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">
          {problem.num}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
          {problem.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {problem.desc}
        </p>
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
    <section id="why" className="py-24 px-6">
      <div className="container mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-4"
        >
          <p className="text-sm uppercase tracking-widest text-primary font-semibold mb-3">
            Por qué existimos
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Conocemos el problema.
          </h2>
          <p className="font-display text-2xl md:text-3xl text-muted-foreground italic">
            Lo vivimos.
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
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Se acabó buscar.
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block gradient-warm px-8 py-4 rounded-full text-base font-semibold text-primary-foreground shadow-soft hover:shadow-card-hover transition-shadow"
          >
            Quiero Mi Primera Caja 📦
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
