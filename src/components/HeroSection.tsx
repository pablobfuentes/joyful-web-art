import { motion } from "framer-motion";
import heroImage from "@/assets/hero-skincare.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Productos de skincare coreano KumiBox"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-32 right-20 w-20 h-20 rounded-full bg-primary/10 blur-xl"
        animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-40 right-40 w-32 h-32 rounded-full bg-secondary/15 blur-2xl"
        animate={{ y: [0, 12, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-body text-sm tracking-widest uppercase text-primary font-semibold mb-4"
          >
            ✨ Skincare Coreano
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="font-display italic text-lg text-muted-foreground mb-4"
          >
            "Hay demasiadas opciones. ¿Por dónde empiezo?"
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Tu ritual coreano,{" "}
            <span className="text-gradient">simplificado</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-lg text-muted-foreground mb-8 max-w-lg"
          >
            Una rutina mensual de skincare coreano cuidadosamente seleccionada
            para adaptarse a tu vida
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex flex-wrap gap-4 mb-6"
          >
            <motion.a
              href="#subscribe"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-warm px-8 py-4 rounded-full text-base font-semibold text-primary-foreground shadow-soft hover:shadow-card-hover transition-shadow"
            >
              Quiero Unirme 🎉
            </motion.a>
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full text-base font-semibold border-2 border-primary text-primary hover:bg-primary/5 transition-colors"
            >
              ¿Cómo Funciona?
            </motion.a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="text-sm text-muted-foreground"
          >
            Cancela cuando quieras · Envíos mensuales · Sin contratos
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
