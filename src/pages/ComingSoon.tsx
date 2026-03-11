import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-skincare.jpg";

const LAUNCH_DATE = new Date("2026-04-15T00:00:00");

function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const floatAnim = (delay: number, dur = 4) => ({
  animate: { y: [0, -12, 0], rotate: [0, 6, -6, 0] },
  transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const, delay },
});

const ComingSoon = () => {
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);

  const countdownBlocks = [
    { value: days, label: "Días" },
    { value: hours, label: "Horas" },
    { value: minutes, label: "Min" },
    { value: seconds, label: "Seg" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Floating decorative blobs */}
      <motion.div
        {...floatAnim(0)}
        className="absolute top-[10%] left-[8%] w-32 h-32 rounded-full bg-[hsl(var(--peach))] opacity-60 blur-2xl"
      />
      <motion.div
        {...floatAnim(1, 5)}
        className="absolute top-[25%] right-[10%] w-40 h-40 rounded-full bg-[hsl(var(--lavender))] opacity-50 blur-2xl"
      />
      <motion.div
        {...floatAnim(2, 3.5)}
        className="absolute bottom-[15%] left-[15%] w-28 h-28 rounded-full bg-[hsl(var(--mint))] opacity-50 blur-2xl"
      />
      <motion.div
        {...floatAnim(0.5, 4.5)}
        className="absolute bottom-[20%] right-[12%] w-36 h-36 rounded-full bg-[hsl(var(--bubblegum))] opacity-40 blur-2xl"
      />
      <motion.div
        {...floatAnim(1.5, 6)}
        className="absolute top-[50%] left-[50%] -translate-x-1/2 w-24 h-24 rounded-full bg-[hsl(var(--sunshine))] opacity-40 blur-3xl"
      />

      {/* Floating emoji accents */}
      <motion.span {...floatAnim(0.3, 3)} className="absolute top-[18%] right-[25%] text-3xl select-none">🧴</motion.span>
      <motion.span {...floatAnim(1.2, 4)} className="absolute bottom-[30%] left-[10%] text-2xl select-none">✨</motion.span>
      <motion.span {...floatAnim(0.8, 3.5)} className="absolute top-[60%] right-[8%] text-2xl select-none">🌸</motion.span>
      <motion.span {...floatAnim(2, 5)} className="absolute top-[12%] left-[30%] text-2xl select-none">💧</motion.span>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="font-display text-5xl sm:text-6xl font-bold text-foreground tracking-tight">
            Kumi<span className="text-primary">Box</span>
          </span>
          <span className="text-4xl sm:text-5xl ml-2">🦊</span>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-8 border border-primary/20"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          Algo increíble viene en camino
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5 text-foreground"
        >
          Tu ritual coreano de skincare,{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-warm)" }}>
            directo a tu puerta
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-lg text-muted-foreground mb-10 max-w-md leading-relaxed"
        >
          Estamos preparando algo especial para ti. Una caja de skincare coreano curada y explicada paso a paso — para que cuidar tu piel sea simple, divertido y efectivo.
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex gap-3 sm:gap-5 mb-10"
        >
          {countdownBlocks.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center bg-card/80 backdrop-blur-md border border-border rounded-2xl px-4 sm:px-6 py-4 shadow-[var(--shadow-card)] min-w-[70px]"
            >
              <motion.span
                key={value}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-display text-3xl sm:text-4xl font-bold text-primary"
              >
                {String(value).padStart(2, "0")}
              </motion.span>
              <span className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Teaser features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {[
            { emoji: "🇰🇷", text: "Directo de Seúl" },
            { emoji: "📦", text: "Entrega mensual" },
            { emoji: "🌿", text: "Productos premium" },
            { emoji: "📖", text: "Guía paso a paso" },
          ].map(({ emoji, text }) => (
            <span
              key={text}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card/70 backdrop-blur-sm border border-border text-sm text-foreground font-medium shadow-sm"
            >
              {emoji} {text}
            </span>
          ))}
        </motion.div>

        {/* Social / CTA hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="text-sm text-muted-foreground"
        >
          Síguenos en{" "}
          <span className="text-primary font-semibold">@kumibox</span>{" "}
          para ser la primera en enterarte 💌
        </motion.p>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none">
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
