import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-skincare.jpg";
import { resolveRegistryImageSrc } from "@/lib/registry-images";
import { registryListToArray } from "@/lib/utils";
import { FloatingDoodle, DoodleDroplet, DoodleSparkle, DoodleHeart, DoodleFlower, DoodleLeaf, DoodleStar } from "./Doodles";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useStyleRegistry } from "@/contexts/StyleRegistryContext";

const ROTATE_INTERVAL_MS = 3000;

const HeroSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const { registry } = useStyleRegistry();
  const data = getSectionContent("hero");
  const quotes = registryListToArray(data.rotatingQuotes as unknown as string[]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const heroImagePath = registry.hero?.image?.path;
  const heroSrc = resolveRegistryImageSrc(heroImagePath, heroImage);

  useEffect(() => {
    if (quotes.length === 0) return;
    const id = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % quotes.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [quotes.length]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-28">
      <div className="absolute inset-0 bg-[hsl(var(--hero-section-bg))]" />

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
            <motion.p
              key={quoteIndex}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display italic text-lg mb-3"
              style={getStyleForPath(`hero.rotatingQuotes.${quoteIndex}`, "--hero-quote-color")}
            >
              "{quotes[quoteIndex] ?? ""}"
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6"
              style={getStyleForPath("hero.heading", "--hero-heading-color")}
            >
              {data.heading}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-lg mb-8 max-w-lg"
              style={getStyleForPath("hero.description", "--hero-description-color")}
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
                className="gradient-warm px-8 py-4 text-lg font-bold text-primary-foreground shadow-playful hover:shadow-card-hover transition-shadow rounded-[var(--hero-primary-radius)]"
              >
                {data.primaryCta.label}
              </motion.a>
              <motion.a
                href={data.secondaryCta.href}
                whileHover={{ scale: 1.08, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 text-lg font-bold border-3 shadow-card transition-colors rounded-[var(--hero-secondary-radius)] border-[hsl(var(--hero-secondary-border))] text-[hsl(var(--hero-secondary-text))] bg-[hsl(var(--hero-secondary-bg))] hover:bg-primary hover:text-primary-foreground"
              >
                {data.secondaryCta.label}
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-sm"
              style={getStyleForPath("hero.footer", "--hero-footer-color")}
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
            <div
              className="relative overflow-hidden shadow-playful"
              style={{
                borderRadius: "var(--hero-image-radius)",
                borderWidth: "var(--hero-image-border-width)",
                borderColor: "hsl(var(--hero-image-border-color))",
                borderStyle: "solid",
              }}
            >
              <img
                src={heroSrc}
                alt="Productos de skincare coreano KumiBox"
                className="w-full object-cover h-[var(--hero-image-height)] md:h-[520px]"
              />
            </div>
            {/* Overlapping decorative badge */}
            <motion.div
              className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-5 py-3 rounded-2xl font-bold text-sm shadow-playful rotate-[-5deg]"
              animate={{ rotate: [-5, -3, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {data.imageBadgeLeft ?? "🇰🇷 Directo de Seúl"}
            </motion.div>
            <motion.div
              className="absolute -top-3 -right-3 bg-sunshine px-4 py-2 rounded-full font-bold text-sm text-foreground shadow-playful rotate-[8deg]"
              animate={{ rotate: [8, 12, 8], scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {data.imageBadgeRight ?? "⭐ 4.9/5"}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
