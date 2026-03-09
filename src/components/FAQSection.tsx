import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { registryListToArray } from "@/lib/utils";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { FloatingDoodle, DoodleSparkle, DoodleFlower, DoodleHeart } from "./Doodles";

const FAQSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="faq" className="relative py-24 px-6 bg-[hsl(var(--faq-section-bg))] overflow-hidden">
      <div className="absolute inset-0 bg-pattern-dots opacity-30" />

      <FloatingDoodle className="top-20 right-[6%] w-10 h-10 text-primary/25" delay={0}>
        <DoodleSparkle className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-24 left-[5%] w-9 h-9 text-secondary/20" delay={1}>
        <DoodleFlower className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-[50%] left-[3%] w-8 h-8 text-accent/25" delay={2}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10 max-w-3xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block bg-peach px-4 py-1 rounded-full text-sm font-bold mb-4 shadow-playful"
            style={getStyleForPath("faq.subtitle", "--foreground")}
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🤓 {data.subtitle}
          </motion.span>
          <h2 className="font-display text-4xl md:text-6xl font-bold" style={getStyleForPath("faq.title", "--foreground")}>
            {data.title}
          </h2>
        </motion.div>

        <div className="space-y-4">
          {registryListToArray(data.items).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="group"
            >
              <motion.div
                className={`rounded-3xl shadow-playful border-4 overflow-hidden transition-all ${
                  openIndex === index ? "border-primary" : "border-background"
                }`}
                style={{ backgroundColor: "hsl(var(--faq-item-bg))" }}
                whileHover={{ scale: 1.01 }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left px-6 py-5 font-display font-bold flex justify-between items-center gap-4"
                  style={getStyleForPath(`faq.items.${index}.question`, "--foreground")}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 gradient-warm rounded-full flex items-center justify-center text-primary-foreground circle-number text-sm shrink-0 shadow-playful">
                      {index + 1}
                    </span>
                    {item.question}
                  </span>
                  <motion.span
                    className="text-2xl text-primary shrink-0"
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pl-[4.25rem]">
                        <p className="text-sm leading-relaxed" style={getStyleForPath(`faq.items.${index}.answer`, "--muted-foreground")}>
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
