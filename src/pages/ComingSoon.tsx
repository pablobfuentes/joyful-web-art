import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import heroImage from "@/assets/hero-skincare.jpg";
import BrandLogo from "@/components/BrandLogo";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useStyleRegistry } from "@/contexts/StyleRegistryContext";
import { resolveRegistryImageSrc } from "@/lib/registry-images";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getCountdown(target: Date): Countdown {
  const targetTime = Number.isNaN(target.getTime()) ? Date.now() : target.getTime();
  const diff = Math.max(0, targetTime - Date.now());

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function useCountdown(target: Date) {
  const [time, setTime] = useState<Countdown>(() => getCountdown(target));

  useEffect(() => {
    setTime(getCountdown(target));
    const intervalId = window.setInterval(() => {
      setTime(getCountdown(target));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [target]);

  return time;
}

const floatAnimation = (delay: number, duration = 4) => ({
  animate: { y: [0, -12, 0], rotate: [0, 6, -6, 0] },
  transition: { duration, repeat: Infinity, ease: "easeInOut" as const, delay },
});

const ComingSoon = () => {
  const { getSectionContent } = useRegistryContent();
  const { registry } = useStyleRegistry();
  const data = getSectionContent("comingSoon");
  const launchDate = useMemo(() => new Date(data.launchDateIso), [data.launchDateIso]);
  const { days, hours, minutes, seconds } = useCountdown(launchDate);
  const heroImagePath = registry.comingSoon?.image?.path;
  const heroSrc = resolveRegistryImageSrc(heroImagePath, heroImage);

  useEffect(() => {
    document.title = data.metadata.title;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", data.metadata.description);
  }, [data.metadata.description, data.metadata.title]);

  const countdownBlocks = [
    { value: days, label: data.countdownLabels.days },
    { value: hours, label: data.countdownLabels.hours },
    { value: minutes, label: data.countdownLabels.minutes },
    { value: seconds, label: data.countdownLabels.seconds },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[hsl(var(--comingSoon-page-bg))]">
      <div className="absolute inset-0">
        <img src={heroSrc} alt="" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <motion.div
        {...floatAnimation(0)}
        className="absolute left-[8%] top-[10%] h-32 w-32 rounded-full bg-[hsl(var(--peach))] opacity-60 blur-2xl"
      />
      <motion.div
        {...floatAnimation(1, 5)}
        className="absolute right-[10%] top-[25%] h-40 w-40 rounded-full bg-[hsl(var(--lavender))] opacity-50 blur-2xl"
      />
      <motion.div
        {...floatAnimation(2, 3.5)}
        className="absolute bottom-[15%] left-[15%] h-28 w-28 rounded-full bg-[hsl(var(--mint))] opacity-50 blur-2xl"
      />
      <motion.div
        {...floatAnimation(0.5, 4.5)}
        className="absolute bottom-[20%] right-[12%] h-36 w-36 rounded-full bg-[hsl(var(--bubblegum))] opacity-40 blur-2xl"
      />
      <motion.div
        {...floatAnimation(1.5, 6)}
        className="absolute left-1/2 top-[50%] h-24 w-24 -translate-x-1/2 rounded-full bg-[hsl(var(--sunshine))] opacity-40 blur-3xl"
      />

      <motion.span {...floatAnimation(0.3, 3)} className="absolute right-[25%] top-[18%] select-none text-3xl">
        🧴
      </motion.span>
      <motion.span {...floatAnimation(1.2, 4)} className="absolute bottom-[30%] left-[10%] select-none text-2xl">
        ✨
      </motion.span>
      <motion.span {...floatAnimation(0.8, 3.5)} className="absolute right-[8%] top-[60%] select-none text-2xl">
        🌸
      </motion.span>
      <motion.span {...floatAnimation(2, 5)} className="absolute left-[30%] top-[12%] select-none text-2xl">
        💧
      </motion.span>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-3"
            data-testid="coming-soon-brand-lockup"
          >
            <span className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              {data.brand.name.slice(0, 4)}
              <span className="text-primary">{data.brand.name.slice(4)}</span>
            </span>
            <BrandLogo
              name={data.brand.name}
              imagePath={typeof data.brand.imagePath === "string" ? data.brand.imagePath : undefined}
              className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            {data.badgeText}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mb-5 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl"
          >
            {data.headingPrefix}{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-warm)" }}>
              {data.headingHighlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-10 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            {data.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mb-10 flex flex-wrap justify-center gap-3 sm:gap-5"
          >
            {countdownBlocks.map(({ value, label }) => (
              <div
                key={label}
                className="min-w-[70px] rounded-2xl border border-border bg-card/80 px-4 py-4 shadow-[var(--shadow-card)] backdrop-blur-md sm:px-6"
              >
                <motion.span
                  key={`${label}-${value}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block font-display text-3xl font-bold text-primary sm:text-4xl"
                >
                  {String(value).padStart(2, "0")}
                </motion.span>
                <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mb-10 flex flex-wrap justify-center gap-3"
          >
            {data.featurePills.map((pill) => (
              <span
                key={pill.text}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm"
              >
                <span aria-hidden="true">{pill.emoji}</span>
                {pill.text}
              </span>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="text-sm text-muted-foreground"
          >
            {data.socialCtaPrefix} <span className="font-semibold text-primary">{data.socialHandle}</span>{" "}
            {data.socialCtaSuffix}
          </motion.p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="h-auto w-full" preserveAspectRatio="none">
          <path
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,70 L1440,120 L0,120 Z"
            fill="hsl(var(--peach))"
            fillOpacity="0.4"
          />
          <path
            d="M0,80 C320,30 640,110 960,60 C1200,20 1360,70 1440,50 L1440,120 L0,120 Z"
            fill="hsl(var(--lavender))"
            fillOpacity="0.3"
          />
        </svg>
      </div>
    </div>
  );
};

export default ComingSoon;
