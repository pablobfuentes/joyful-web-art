import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { APP_REGISTRY } from "@/config/app-registry";
import { FloatingDoodle, DoodleSparkle } from "./Doodles";

const data = APP_REGISTRY.faq;

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="faq" className="relative py-24 px-6 bg-peach/20 overflow-hidden">
      <FloatingDoodle className="top-28 right-[8%] w-8 h-8 text-primary/20" delay={0}>
        <DoodleSparkle className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10 max-w-3xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary mb-2">{data.subtitle}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">{data.title}</h2>
        </motion.div>

        <div className="space-y-3">
          {data.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-background rounded-2xl shadow-playful border-2 border-background overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-6 py-4 font-display font-bold text-foreground flex justify-between items-center gap-4"
              >
                {item.question}
                <span className="text-2xl text-primary shrink-0">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-4"
                >
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
