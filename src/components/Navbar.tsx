import { motion } from "framer-motion";
import { FloatingDoodle, DoodleSparkle, DoodleHeart, DoodleFlower } from "./Doodles";

const navItems = [
  { label: "Shop", href: "#subscribe", emoji: "🛍️" },
  { label: "Nuestra Historia", href: "#why", emoji: "💖" },
  { label: "Cómo Funciona", href: "#how-it-works", emoji: "✨" },
];

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md"
    >
      {/* Cute announcement bar */}
      <div className="gradient-warm text-primary-foreground text-center py-1.5 text-xs font-semibold tracking-wide">
        🎉 ¡Envío GRATIS en tu primera caja! · Más de 500 ⭐⭐⭐⭐⭐ reseñas
      </div>

      <div className="container mx-auto flex items-center justify-between py-3 px-6">
        <a href="#" className="flex items-center gap-2 group">
          <motion.span
            className="text-3xl"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🦊
          </motion.span>
          <span className="font-display text-2xl font-bold text-gradient">
            KumiBox
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 rounded-full text-sm font-semibold text-foreground hover:bg-peach hover:text-primary transition-all duration-300"
            >
              <span className="mr-1">{item.emoji}</span>
              {item.label}
            </a>
          ))}
        </div>

        <motion.a
          href="#subscribe"
          whileHover={{ scale: 1.08, rotate: -2 }}
          whileTap={{ scale: 0.95 }}
          className="gradient-warm px-6 py-2.5 rounded-full text-sm font-bold text-primary-foreground shadow-playful hover:shadow-card-hover transition-shadow"
        >
          ¡Suscríbete! 💌
        </motion.a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
