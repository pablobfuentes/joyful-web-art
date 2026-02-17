import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import WaveDivider from "@/components/WaveDivider";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <WaveDivider
        topColor="hsl(var(--peach))"
        bottomColor="hsl(var(--background))"
        variant="wave1"
      />
      <ProblemSection />
      <WaveDivider
        topColor="hsl(var(--background))"
        bottomColor="hsl(var(--peach-strong))"
        variant="blob"
      />
      <HowItWorksSection />
      <WaveDivider
        topColor="hsl(var(--peach-strong))"
        bottomColor="hsl(var(--background))"
        variant="wave2"
      />
    </div>
  );
};

export default Index;
