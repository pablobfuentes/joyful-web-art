import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { registryListToArray } from "@/lib/utils";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { FloatingDoodle, DoodleFlower, DoodleStar, DoodleHeart } from "./Doodles";
import { useStyleRegistry } from "@/contexts/StyleRegistryContext";

const FALLBACK_EDITION_IMAGE =
  "https://placehold.co/590x640/e8e4de/2d2620?text=Past+Edition";

const PastEditionsSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("pastEditions");
  const editions = registryListToArray(data.editions);
  const { registry } = useStyleRegistry();
  const fallbackImage =
    (data.fallbackImage as string) || FALLBACK_EDITION_IMAGE;

  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== fallbackImage) target.src = fallbackImage;
  };

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const listRef = useRef<HTMLUListElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(
    editions.length > 0 ? Math.floor(editions.length / 2) : 0
  );
  const transitionTimeout = useRef<number | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    if (transitionTimeout.current !== null) {
      window.clearTimeout(transitionTimeout.current);
    }

    el.style.setProperty(
      "--transition",
      "600ms cubic-bezier(0.22, 0.61, 0.36, 1)"
    );

    transitionTimeout.current = window.setTimeout(() => {
      el.style.removeProperty("--transition");
    }, 900);

    return () => {
      if (transitionTimeout.current !== null) {
        window.clearTimeout(transitionTimeout.current);
      }
    };
  }, [activeIndex]);

  return (
    <section className="relative py-24 bg-[hsl(var(--pastEditions-section-bg))] overflow-hidden">
      <div className="absolute inset-0 bg-pattern-dots opacity-30" />

      <FloatingDoodle className="top-20 right-[6%] w-10 h-10 text-primary/25" delay={0}>
        <DoodleFlower className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="bottom-16 left-[5%] w-9 h-9 text-secondary/25" delay={1}>
        <DoodleStar className="w-full h-full" />
      </FloatingDoodle>
      <FloatingDoodle className="top-[50%] left-[3%] w-8 h-8 text-accent/20" delay={2}>
        <DoodleHeart className="w-full h-full" />
      </FloatingDoodle>

      <div className="container mx-auto relative z-10 px-6">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <motion.span
            className="inline-block bg-mint px-4 py-1 rounded-full text-sm font-bold mb-4 shadow-playful"
            style={getStyleForPath("pastEditions.subtitle", "--foreground")}
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {data.subtitleEmoji} {data.subtitle}
          </motion.span>
          <h2
            className="font-display text-4xl md:text-6xl font-bold"
            style={getStyleForPath("pastEditions.title", "--foreground")}
          >
            {data.title}
          </h2>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto">
        <ul
          ref={listRef}
          className="flex w-full flex-col gap-4 md:h-[420px] md:flex-row md:gap-[1.5%]"
        >
          {editions.map((edition, index) => {
            const isActive = index === activeIndex;
            const cards = registry.pastEditions.cards ?? [];
            const colorIndex = cards.length > 0 ? index % cards.length : 0;

            return (
              <li
                key={edition?.name ?? index}
                onClick={() => setActiveIndex(index)}
                aria-current={isActive}
                className="relative group cursor-pointer transition-all duration-500 ease-in-out md:w-[8%] md:[&[aria-current='true']]:w-[52%] md:[transition:width_var(--transition,300ms_ease_in)]"
              >
                <motion.div
                  className={`relative w-full overflow-hidden rounded-3xl shadow-playful border-4 border-background ${isActive ? "max-md:min-h-[40vh] max-md:max-h-[55vh]" : "h-40"} md:h-full`}
                  style={{
                    backgroundColor: `hsl(var(--pastEditions-card-${colorIndex}-bg))`,
                  }}
                  whileHover={{ scale: 1.03, y: -8 }}
                >
                  <img
                    src={(edition as { image?: string }).image || fallbackImage}
                    alt={(edition as { name?: string }).name ?? ""}
                    onError={onImageError}
                    className={`absolute left-1/2 top-1/2 h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2 object-cover transition-all duration-500 ease-in-out ${isActive ? "scale-105 grayscale-0" : "scale-100 grayscale"}`}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent transition-opacity duration-500 ease-in-out"
                    style={{ opacity: isActive ? 1 : 0 }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-full p-4 md:p-6 text-left text-white transition-all duration-500 ease-in-out"
                    style={{
                      transform: isActive ? "translateY(0)" : "translateY(14px)",
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-widest text-gray-200 md:text-sm"
                      style={getStyleForPath(
                        `pastEditions.editions.${index}.category`,
                        "--muted-foreground"
                      )}
                    >
                      {edition.category}
                    </p>
                    <p
                      className="text-lg md:text-2xl font-bold tracking-tight"
                      style={getStyleForPath(
                        `pastEditions.editions.${index}.name`,
                        "--foreground"
                      )}
                    >
                      {edition.name}
                    </p>
                    <p
                      className="text-xs md:text-sm mt-1 font-semibold text-gray-200/90"
                      style={getStyleForPath(
                        `pastEditions.editions.${index}.month`,
                        "--muted-foreground"
                      )}
                    >
                      {edition.month}
                    </p>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default PastEditionsSection;
