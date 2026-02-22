import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import Navbar from "@/components/Navbar";

export default function CheckoutCancel() {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("checkout");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-lg mx-auto text-center py-16">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{data.cancelTitle}</h1>
          <p className="text-muted-foreground text-lg mb-8">{data.cancelMessage}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => navigate("/checkout")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="gradient-warm px-6 py-3 rounded-full font-bold text-primary-foreground shadow-playful"
            >
              {data.cancelBackToCheckout}
            </motion.button>
            <motion.button
              onClick={() => navigate("/#pricing")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="border-2 border-primary px-6 py-3 rounded-full font-bold text-primary"
            >
              {data.cancelBackToPricing}
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
}
