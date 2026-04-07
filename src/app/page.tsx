import { ContactSection } from "@/components/landing/contact-section";
import { HeroSection } from "@/components/landing/hero-section";
import { PortfolioSection } from "@/components/landing/portfolio-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />
      <PortfolioSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}
