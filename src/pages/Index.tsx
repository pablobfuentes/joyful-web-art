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
        bottomColor="hsl(var(--lavender))"
        variant="wave2"
      />
      <CompatibilityTestSection />
      <WaveDivider
        topColor="hsl(var(--lavender))"
        bottomColor="hsl(var(--peach))"
        variant="wave1"
      />
      <WhatYouReceiveSection />
      <WaveDivider
        topColor="hsl(var(--peach))"
        bottomColor="hsl(var(--background))"
        variant="blob"
      />
      <PastEditionsSection />
      <WaveDivider
        topColor="hsl(var(--background))"
        bottomColor="hsl(var(--mint))"
        variant="zigzag"
      />
      <ExperienceSection />
      <WaveDivider
        topColor="hsl(var(--mint))"
        bottomColor="hsl(var(--sunshine))"
        variant="wave2"
      />
      <TestimonialsSection />
      <WaveDivider
        topColor="hsl(var(--sunshine))"
        bottomColor="hsl(var(--peach-strong))"
        variant="wave1"
      />
      <PricingSection />
      <WaveDivider
        topColor="hsl(var(--peach-strong))"
        bottomColor="hsl(var(--lavender))"
        variant="blob"
      />
      <FAQSection />
      <WaveDivider
        topColor="hsl(var(--lavender))"
        bottomColor="hsl(var(--peach-strong))"
        variant="wave2"
      />
      <FinalCTASection />
      <WaveDivider
        topColor="hsl(var(--peach-strong))"
        bottomColor="hsl(var(--background))"
        variant="wave1"
      />
      <FooterSection />
    </div>
  );
};

export default Index;
