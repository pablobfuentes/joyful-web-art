import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-skincare.jpg";
import { FloatingDoodle, DoodleDroplet, DoodleSparkle, DoodleHeart, DoodleFlower, DoodleLeaf, DoodleStar } from "./Doodles";
import { APP_REGISTRY } from "@/config/app-registry";

const data = APP_REGISTRY.hero;
const ROTATE_INTERVAL_MS = 3000;

const HeroSection = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % data.rotatingQuotes.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-28">
      <div className="absolute inset-0 bg-peach" />
      <div className="absolute inset-0 bg-pattern-skincare opacity-60" />

      <FloatingDoodle className="top-32 left-[8%] w-10 h-10 text-primary/40" delay={0}>
        <DoodleDroplet className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-40 right-[12%] w-8 h-8 text-secondary/50" delay={1}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-32 left-[15%] w-12 h-12 text-accent/30" delay={2}>
        <DoodleLeaf className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-[20%] right-[5%] w-9 h-9 text-primary/30" delay={0.5}>
        <DoodleSparkle className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-[20%] right-[20%] w-7 h-7 text-secondary/40" delay={1.5} duration={3}>
        <DoodleFlower className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-[60%] left-[5%] w-6 h-6 text-primary/25" delay={2.5} duration={5}>
        <DoodleStar className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="inline-block bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-bold mb-6 shadow-playful rotate-[-2deg]"
            >
              ✨ Skincare Coreano ✨
            </motion.div>

            <motion.p
              key={quoteIndex}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display italic text-lg text-foreground/70 mb-3"
            >
              "{data.rotatingQuotes[quoteIndex]}"
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6"
            >
              {data.heading}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg"
            >
              {data.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-wrap gap-4 mb-6"
            >
              <motion.a
                href={data.primaryCta.href}
                whileHover={{ scale: 1.08, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
                className="gradient-warm px-8 py-4 rounded-full text-lg font-bold text-primary-foreground shadow-playful hover:shadow-card-hover transition-shadow"
              >
                {data.primaryCta.label}
              </motion.a>
              <motion.a
                href={data.secondaryCta.href}
                whileHover={{ scale: 1.08, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full text-lg font-bold border-3 border-primary text-primary bg-background/80 hover:bg-primary hover:text-primary-foreground transition-colors shadow-card"
              >
                {data.secondaryCta.label}
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-sm text-foreground/80"
            >
              {data.footer}
            </motion.div>
          </div>

          {/* Image side - playful framing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-playful border-4 border-background">
              <img
                src={heroImage}
                alt="Productos de skincare coreano KumiBox"
                className="w-full h-[450px] md:h-[520px] object-cover"
              />
            </div>
            {/* Overlapping decorative badge */}
            <motion.div
              className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-5 py-3 rounded-2xl font-bold text-sm shadow-playful rotate-[-5deg]"
              animate={{ rotate: [-5, -3, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🇰🇷 Directo de Seúl
            </motion.div>
            <motion.div
              className="absolute -top-3 -right-3 bg-sunshine px-4 py-2 rounded-full font-bold text-sm text-foreground shadow-playful rotate-[8deg]"
              animate={{ rotate: [8, 12, 8], scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⭐ 4.9/5
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
