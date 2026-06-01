import { BenefitsSection } from "@/components/landing/benefits-section";
import { CooperationPricingBlock } from "@/components/landing/cooperation-pricing-block";
import { FaqSection } from "@/components/landing/faq-section";
import { HeroSection } from "@/components/landing/hero-section";
import { PortfolioSection } from "@/components/landing/portfolio-section";
import { ProblemSection } from "@/components/landing/problem-section";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col pb-24 md:pb-0">
      <HeroSection />
      <BenefitsSection />
      <ProblemSection />
      <PortfolioSection />
      <CooperationPricingBlock />
      <FaqSection />
    </div>
  );
}
