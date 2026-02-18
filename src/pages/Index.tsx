import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CompatibilityTestSection from "@/components/CompatibilityTestSection";
import WhatYouReceiveSection from "@/components/WhatYouReceiveSection";
import PastEditionsSection from "@/components/PastEditionsSection";
import ExperienceSection from "@/components/ExperienceSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/FinalCTASection";
import FooterSection from "@/components/FooterSection";
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
      <CompatibilityTestSection />
      <WaveDivider
        topColor="hsl(var(--background))"
        bottomColor="hsl(var(--peach))"
        variant="wave1"
      />
      <WhatYouReceiveSection />
      <PastEditionsSection />
      <WaveDivider
        topColor="hsl(var(--peach))"
        bottomColor="hsl(var(--background))"
        variant="blob"
      />
      <ExperienceSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <WaveDivider
        topColor="hsl(var(--peach))"
        bottomColor="hsl(var(--peach-strong))"
        variant="wave2"
      />
      <FinalCTASection />
      <FooterSection />
    </div>
  );
};

export default Index;
