import { ContactSection } from "@/components/landing/contact-section";
import { HeroSection } from "@/components/landing/hero-section";
import { PortfolioSection } from "@/components/landing/portfolio-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { WeddingShowcaseSection } from "@/components/landing/wedding-showcase-section";
import { WelcomeScreen } from "@/components/landing/welcome-screen";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <WelcomeScreen />
      <div id="glowna-tresc" className="flex flex-1 flex-col scroll-mt-[4.5rem]">
        <HeroSection />
        <WeddingShowcaseSection />
        <PortfolioSection />
        <TestimonialsSection />
        <ContactSection />
      </div>
    </div>
  );
}
