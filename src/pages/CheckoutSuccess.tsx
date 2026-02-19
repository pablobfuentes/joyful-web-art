import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { APP_REGISTRY } from "@/config/app-registry";
import Navbar from "@/components/Navbar";

const data = APP_REGISTRY.checkout;

export default function CheckoutSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-lg mx-auto text-center py-16">
          <motion.span
            className="text-7xl inline-block mb-6"
            animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎉
          </motion.span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{data.successTitle}</h1>
          <p className="text-muted-foreground text-lg mb-8">{data.successMessage}</p>
          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="gradient-warm px-8 py-4 rounded-full text-lg font-bold text-primary-foreground shadow-playful"
          >
            Volver al inicio ✨
          </motion.button>
        </div>
      </main>
    </div>
  );
}
