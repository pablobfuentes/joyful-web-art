import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { registryListToArray } from "@/lib/utils";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { FloatingDoodle, DoodleHeart, DoodleSparkle, DoodleFlower, DoodleStar } from "./Doodles";

const CompatibilityTestSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("compatibilityTest");
  const questions = registryListToArray(data.questions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(questions.map(() => null));
  const [result, setResult] = useState<"dermatologist" | "goodfit" | null>(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  const handleAnswer = (yes: boolean) => {
    const next = [...answers];
    next[currentQuestion] = yes;
    setAnswers(next);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const hasNo = next.some((a) => a === false);
      const firstIsYes = next[0] === true;
      setResult(firstIsYes && hasNo ? "dermatologist" : "goodfit");
    }
  };

  const reset = () => {
    setCurrentQuestion(0);
    setAnswers(questions.map(() => null));
    setResult(null);
  };

  return (
    <section id="compatibility" className="relative py-24 px-6 bg-[hsl(var(--compatibilityTest-section-bg))] overflow-hidden">
      <div className="absolute inset-0 bg-pattern-dots opacity-40" />

      <FloatingDoodle className="top-16 right-[8%] w-10 h-10 text-secondary/30" delay={0}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-20 left-[5%] w-12 h-12 text-primary/20" delay={1}>
        <DoodleSparkle className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-[45%] left-[3%] w-8 h-8 text-accent/25" delay={2}>
        <DoodleFlower className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-32 left-[40%] w-7 h-7 text-primary/15" delay={0.5}>
        <DoodleStar className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10 max-w-2xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <motion.span
            className="inline-block bg-bubblegum px-4 py-1 rounded-full text-sm font-bold mb-4 shadow-playful"
            style={getStyleForPath("compatibilityTest.subtitle", "--foreground")}
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✨ {data.subtitle}
          </motion.span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4" style={getStyleForPath("compatibilityTest.title", "--foreground")}>
            {data.title}
          </h2>
          {result === null && (
            <p className="text-lg" style={getStyleForPath("compatibilityTest.triggerLabel", "--muted-foreground")}>
              {data.triggerLabel}
            </p>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {result === null ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 40, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -40, rotate: -2 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl p-8 md:p-10 shadow-playful border-4 border-white relative overflow-visible"
              style={{ backgroundColor: "hsl(var(--compatibilityTest-question-card-bg))" }}
            >
              {/* Floating emoji */}
              <motion.span
                className="absolute -top-5 -right-3 text-4xl"
                animate={{ y: [0, -8, 0], rotate: [0, 15, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                🤔
              </motion.span>

              <p className="text-sm text-primary font-bold mb-2">
                Pregunta {currentQuestion + 1} de {questions.length}
              </p>
              <p className="font-display text-xl md:text-2xl font-bold mb-8" style={getStyleForPath(`compatibilityTest.questions.${currentQuestion}`, "--foreground")}>
                {questions[currentQuestion]}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button
                  onClick={() => handleAnswer(true)}
                  whileHover={{ scale: 1.08, rotate: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 gradient-warm py-4 min-h-[44px] rounded-full font-bold text-primary-foreground shadow-playful text-lg"
                >
                  Sí 👍
                </motion.button>
                <motion.button
                  onClick={() => handleAnswer(false)}
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-4 min-h-[44px] rounded-full font-bold border-4 border-primary text-primary bg-background text-lg shadow-playful"
                >
                  No 👎
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="rounded-3xl p-8 md:p-10 shadow-playful border-4 border-white text-center relative overflow-visible"
              style={{ backgroundColor: "hsl(var(--compatibilityTest-result-card-bg))" }}
            >
              <motion.span
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {result === "goodfit" ? "🎉" : "🩺"}
              </motion.span>

              <p className="font-display text-xl md:text-2xl font-bold mb-6 mt-4" style={getStyleForPath(result === "dermatologist" ? "compatibilityTest.resultDermatologist" : "compatibilityTest.resultGoodFit", "--foreground")}>
                {result === "dermatologist" ? data.resultDermatologist : data.resultGoodFit}
              </p>
              <motion.a
                href="#pricing"
                whileHover={{ scale: 1.08, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block gradient-warm px-10 py-5 rounded-full font-bold text-primary-foreground shadow-playful text-lg mb-4"
                style={getStyleForPath("compatibilityTest.ctaButton", "--primary-foreground")}
              >
                {data.ctaButton} ✨
              </motion.a>
              <button
                onClick={reset}
                className="block mx-auto text-sm text-muted-foreground hover:text-foreground font-bold mt-2"
              >
                🔄 Volver a hacer el test
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CompatibilityTestSection;
