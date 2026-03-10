import { motion, useInView, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { registryListToArray } from "@/lib/utils";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useStyleRegistry } from "@/contexts/StyleRegistryContext";
import { FloatingDoodle, DoodleStar, DoodleHeart, DoodleSparkle } from "./Doodles";

const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [breakpoint]);

  return isMobile;
};

const makeSafeImage =
  (fallback: string) => (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = fallback;
  };

const SHOW_TESTIMONIALS = false;

const TestimonialsSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("testimonials");
  const { registry } = useStyleRegistry();
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  const people = registryListToArray(data.people);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  const fallbackAvatar = (data.fallbackAvatar as string) || "https://placehold.co/100x100/E0E7FF/4338CA?text=Error";
  const safeImage = makeSafeImage(fallbackAvatar);

  const containerRadius = isMobile ? 150 : 240;
  const profileSize = isMobile ? 70 : 90;
  const baseContainerSize = containerRadius * 2 + 140;

  const [containerSize, setContainerSize] = useState(343);
  useEffect(() => {
    const update = () => {
      const w = typeof window !== "undefined" ? window.innerWidth - 32 : 343;
      setContainerSize(Math.min(baseContainerSize, Math.max(280, w)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [baseContainerSize]);

  const getRotation = useCallback(
    (index: number): number =>
      (index - activeIndex) * (360 / Math.max(people.length, 1)),
    [activeIndex, people.length]
  );

  const next = () =>
    setActiveIndex((i) => (i + 1) % Math.max(people.length, 1));
  const prev = () =>
    setActiveIndex((i) => (i - 1 + Math.max(people.length, 1)) % Math.max(people.length, 1));

  const handleProfileClick = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setActiveIndex(index);
    },
    [activeIndex]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") prev();
      else if (event.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!SHOW_TESTIMONIALS) {
    return null;
  }

  return (
    <section className="relative py-24 bg-[hsl(var(--testimonials-section-bg))] overflow-hidden">
      <FloatingDoodle className="top-20 right-[10%] w-10 h-10 text-primary/25" delay={0}>
        <DoodleStar className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-24 left-[6%] w-9 h-9 text-secondary/30" delay={1}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-[50%] left-[4%] w-8 h-8 text-accent/20" delay={2}>
        <DoodleSparkle className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10 px-6">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <motion.p
            className="text-base md:text-lg font-semibold"
            style={getStyleForPath("testimonials.subtitle", "--foreground")}
          >
            {data.subtitleEmoji} {data.subtitle}
          </motion.p>
        </motion.div>
      </div>

      {/* Orbiting carousel */}
      <div className="flex flex-col items-center p-4 relative min-h-[420px]">
        <div
          className="relative flex items-center justify-center"
          style={{ width: containerSize, height: containerSize }}
        >
          {/* Single orbit circle */}
          <div
            className="absolute rounded-full border border-foreground/20"
            style={{
              width: containerRadius * 2,
              height: containerRadius * 2,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Active person card */}
          <AnimatePresence mode="wait">
            {people.length > 0 && (
              <motion.div
                key={(people[activeIndex] as any).id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="z-10 backdrop-blur-sm shadow-xl rounded-xl p-5 md:p-6 w-64 md:w-80 text-center border border-foreground/5"
                style={{
                  backgroundColor: `hsl(var(--testimonials-card-${
                    (registry.testimonials.cards?.length ?? 0) > 0
                      ? activeIndex % (registry.testimonials.cards!.length)
                      : 0
                  }-bg))`,
                }}
              >
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  src={(people[activeIndex] as any).profile}
                  alt={(people[activeIndex] as any).name}
                  onError={safeImage}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto -mt-10 md:-mt-12 border-4 border-background object-cover shadow-md"
                />
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <p className="mt-4 text-sm md:text-base italic leading-relaxed mb-3 text-muted-foreground">
                    {(people[activeIndex] as any).quote}
                  </p>
                  <h2 className="mt-1 text-base md:text-lg font-bold">
                    {(people[activeIndex] as any).name}
                  </h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex justify-center items-center mt-3 space-x-2"
                >
                  <button
                    type="button"
                    onClick={prev}
                    className="p-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="p-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={16} />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Orbiting profiles with counter-rotation */}
          {people.map((p: any, i: number) => {
            const rotation = getRotation(i);
            return (
              <motion.div
                key={p.id}
                animate={{
                  transform: `rotate(${rotation}deg) translateY(-${containerRadius}px)`,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                style={{
                  width: profileSize,
                  height: profileSize,
                  position: "absolute",
                  top: `calc(50% - ${profileSize / 2}px)`,
                  left: `calc(50% - ${profileSize / 2}px)`,
                }}
              >
                <motion.div
                  animate={{ rotate: -rotation }}
                  transition={{
                    duration: 0.8,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="w-full h-full"
                >
                  <motion.img
                    src={p.profile}
                    alt={p.name}
                    onError={safeImage}
                    onClick={() => handleProfileClick(i)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full h-full object-cover rounded-full cursor-pointer transition-all duration-300 ${
                      i === activeIndex
                        ? "border-4 border-primary shadow-lg"
                        : "border-2 border-muted-foreground/40 hover:border-primary"
                    }`}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
