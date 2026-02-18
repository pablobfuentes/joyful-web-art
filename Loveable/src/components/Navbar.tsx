import { motion } from "framer-motion";

const navItems = [
  { label: "Shop", href: "#subscribe" },
  { label: "Nuestra Historia", href: "#why" },
  { label: "Contacto", href: "#how-it-works" },
];

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="#" className="flex items-center gap-2">
          <span className="text-2xl">🦊</span>
          <span className="font-display text-xl font-bold text-foreground">
            KumiBox
          </span>
        </a>

        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        <motion.a
          href="#subscribe"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="gradient-warm px-5 py-2.5 rounded-full text-sm font-semibold text-primary-foreground shadow-soft transition-shadow hover:shadow-card-hover"
        >
          Suscríbete
        </motion.a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
