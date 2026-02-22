import { motion } from "framer-motion";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { DoodleHeart, DoodleSparkle } from "./Doodles";

const FooterSection = () => {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("footer");
  return (
    <footer className="relative bg-[hsl(var(--footer-section-bg))] py-16 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-pattern-dots opacity-20" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                className="text-primary"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <DoodleHeart className="w-6 h-6" />
              </motion.div>
              <h3 className="font-display text-xl font-bold text-foreground">{data.mission.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.mission.description}</p>
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground mb-4">{data.navigate.title}</h3>
            <ul className="space-y-2">
              {data.navigate.links.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 4 }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground mb-4">{data.connect.title}</h3>
            <ul className="space-y-2">
              {data.connect.links.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 4 }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground mb-4">{data.newsletter.title}</h3>
            <div className="relative">
              <input
                type="email"
                placeholder={data.newsletter.placeholder}
                className="w-full px-5 py-3 rounded-full border-4 border-peach bg-background text-sm font-medium focus:border-primary outline-none transition-colors shadow-playful"
              />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: [0, 15, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <DoodleSparkle className="w-5 h-5 text-primary/40" />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t-4 border-peach flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-medium">{data.bottomBar.copyright}</p>
          <div className="flex gap-6">
            {data.bottomBar.links.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                whileHover={{ y: -2 }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
