import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { APP_REGISTRY } from "@/config/app-registry";
import { FloatingDoodle, DoodleHeart, DoodleSparkle } from "./Doodles";

const data = APP_REGISTRY.compatibilityTest;

const CompatibilityTestSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(data.questions.map(() => null));
  const [result, setResult] = useState<"dermatologist" | "goodfit" | null>(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  const handleAnswer = (yes: boolean) => {
    const next = [...answers];
    next[currentQuestion] = yes;
    setAnswers(next);
    if (currentQuestion < data.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const hasNo = next.some((a) => a === false);
      const firstIsYes = next[0] === true;
      setResult(firstIsYes && hasNo ? "dermatologist" : "goodfit");
    }
  };

  const reset = () => {
    setCurrentQuestion(0);
    setAnswers(data.questions.map(() => null));
    setResult(null);
  };

  return (
    <section id="compatibility" className="relative py-24 px-6 bg-background overflow-hidden">
      <FloatingDoodle className="top-20 right-[10%] w-8 h-8 text-primary/20" delay={0}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-32 left-[5%] w-10 h-10 text-secondary/20" delay={1}>
        <DoodleSparkle className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10 max-w-2xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-primary mb-2">{data.subtitle}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">{data.title}</h2>
          {result === null && (
            <p className="text-muted-foreground">{data.triggerLabel}</p>
          )}
        </motion.div>

        {result === null ? (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-peach/30 rounded-3xl p-8 shadow-playful border-2 border-background"
          >
            <p className="text-sm text-muted-foreground mb-2">
              Pregunta {currentQuestion + 1} de {data.questions.length}
            </p>
            <p className="font-display text-xl md:text-2xl font-bold mb-8">
              {data.questions[currentQuestion]}
            </p>
            <div className="flex gap-4">
              <motion.button
                onClick={() => handleAnswer(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 gradient-warm py-4 rounded-full font-bold text-primary-foreground shadow-playful"
              >
                Sí
              </motion.button>
              <motion.button
                onClick={() => handleAnswer(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 rounded-full font-bold border-2 border-primary text-primary bg-background"
              >
                No
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-mint/30 rounded-3xl p-8 shadow-playful border-2 border-background text-center"
          >
            <p className="font-display text-xl md:text-2xl font-bold mb-6">
              {result === "dermatologist" ? data.resultDermatologist : data.resultGoodFit}
            </p>
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block gradient-warm px-8 py-4 rounded-full font-bold text-primary-foreground shadow-playful mb-4"
            >
              {data.ctaButton}
            </motion.a>
            <button
              onClick={reset}
              className="block mx-auto text-sm text-muted-foreground hover:text-foreground"
            >
              Volver a hacer el test
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CompatibilityTestSection;
