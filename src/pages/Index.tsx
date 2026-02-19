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
import { STYLE_REGISTRY } from "@/config/style-registry";

const DIVIDER_VARIANT_MAP: Record<string, "wave1" | "wave2" | "blob" | "zigzag"> = {
  wavy: "wave1",
  wavy2: "wave2",
  blob: "blob",
  sawtooth: "zigzag",
};

const Index = () => {
  const heroDiv = STYLE_REGISTRY.hero.divider!;
  const whyDiv = STYLE_REGISTRY.why.divider!;
  const howDiv = STYLE_REGISTRY.howItWorks.divider!;
  const compatDiv = STYLE_REGISTRY.compatibilityTest.divider!;
  const whatDiv = STYLE_REGISTRY.whatYouReceive.divider!;
  const pastDiv = STYLE_REGISTRY.pastEditions.divider!;
  const expDiv = STYLE_REGISTRY.experience.divider!;
  const testDiv = STYLE_REGISTRY.testimonials.divider!;
  const priceDiv = STYLE_REGISTRY.pricing.divider!;
  const faqDiv = STYLE_REGISTRY.faq.divider!;
  const finalDiv = STYLE_REGISTRY.finalCta.divider!;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <WaveDivider
        topColor={`hsl(var(--palette-${heroDiv.topColorIndex}))`}
        bottomColor={`hsl(var(--palette-${heroDiv.bottomColorIndex}))`}
        variant={DIVIDER_VARIANT_MAP[heroDiv.style] ?? "wave1"}
      />
      <ProblemSection />
      <WaveDivider
        topColor={`hsl(var(--palette-${whyDiv.topColorIndex}))`}
        bottomColor={`hsl(var(--palette-${whyDiv.bottomColorIndex}))`}
        variant={DIVIDER_VARIANT_MAP[whyDiv.style] ?? "blob"}
      />
      <HowItWorksSection />
      <WaveDivider
        topColor={`hsl(var(--palette-${howDiv.topColorIndex}))`}
        bottomColor={`hsl(var(--palette-${howDiv.bottomColorIndex}))`}
        variant={DIVIDER_VARIANT_MAP[howDiv.style] ?? "wave2"}
      />
      <CompatibilityTestSection />
      <WaveDivider
        topColor={`hsl(var(--palette-${compatDiv.topColorIndex}))`}
        bottomColor={`hsl(var(--palette-${compatDiv.bottomColorIndex}))`}
        variant={DIVIDER_VARIANT_MAP[compatDiv.style] ?? "wave1"}
      />
      <WhatYouReceiveSection />
      <WaveDivider
        topColor={`hsl(var(--palette-${whatDiv.topColorIndex}))`}
        bottomColor={`hsl(var(--palette-${whatDiv.bottomColorIndex}))`}
        variant={DIVIDER_VARIANT_MAP[whatDiv.style] ?? "blob"}
      />
      <PastEditionsSection />
      <WaveDivider
        topColor={`hsl(var(--palette-${pastDiv.topColorIndex}))`}
        bottomColor={`hsl(var(--palette-${pastDiv.bottomColorIndex}))`}
        variant={DIVIDER_VARIANT_MAP[pastDiv.style] ?? "zigzag"}
      />
      <ExperienceSection />
      <WaveDivider
        topColor={`hsl(var(--palette-${expDiv.topColorIndex}))`}
        bottomColor={`hsl(var(--palette-${expDiv.bottomColorIndex}))`}
        variant={DIVIDER_VARIANT_MAP[expDiv.style] ?? "wave2"}
      />
      <TestimonialsSection />
      <WaveDivider
        topColor={`hsl(var(--palette-${testDiv.topColorIndex}))`}
        bottomColor={`hsl(var(--palette-${testDiv.bottomColorIndex}))`}
        variant={DIVIDER_VARIANT_MAP[testDiv.style] ?? "wave1"}
      />
      <PricingSection />
      <WaveDivider
        topColor={`hsl(var(--palette-${priceDiv.topColorIndex}))`}
        bottomColor={`hsl(var(--palette-${priceDiv.bottomColorIndex}))`}
        variant={DIVIDER_VARIANT_MAP[priceDiv.style] ?? "blob"}
      />
      <FAQSection />
      <WaveDivider
        topColor={`hsl(var(--palette-${faqDiv.topColorIndex}))`}
        bottomColor={`hsl(var(--palette-${faqDiv.bottomColorIndex}))`}
        variant={DIVIDER_VARIANT_MAP[faqDiv.style] ?? "wave2"}
      />
      <FinalCTASection />
      <WaveDivider
        topColor={`hsl(var(--palette-${finalDiv.topColorIndex}))`}
        bottomColor={`hsl(var(--palette-${finalDiv.bottomColorIndex}))`}
        variant={DIVIDER_VARIANT_MAP[finalDiv.style] ?? "wave1"}
      />
      <FooterSection />
    </div>
  );
};

export default Index;
