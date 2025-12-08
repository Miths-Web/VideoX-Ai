import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/hero-section";

const FeaturesSection = dynamic(() => import("@/components/home/features-section"), {
  loading: () => <div className="py-20 bg-muted/50 min-h-[600px]" />,
});


const FAQSection = dynamic(() => import("@/components/home/faq-section"), {
  loading: () => <div className="py-20 min-h-[400px]" />,
});

const HowItWorksSection = dynamic(() => import("@/components/home/how-it-works-section"), {
  loading: () => <div className="py-20 min-h-[600px]" />,
});

const CTASection = dynamic(() => import("@/components/home/cta-section"), {
  loading: () => <div className="py-20 bg-primary/5 min-h-[400px]" />,
});

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
}