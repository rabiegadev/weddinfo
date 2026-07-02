import type { Metadata } from "next";
import Link from "next/link";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";
import { SubpageHero } from "@/components/subpage-hero";
import { PricingPlanDetailSection } from "@/components/pricing/pricing-sections";
import { pricingPlans } from "@/data/pricing-plans";

export const metadata: Metadata = {
  title: "Cennik",
  description:
    "Pakiety Weddinfo: podstawowy i indywidualny. Porównaj zakres usług i wybierz wizytówkę weselną dopasowaną do Was.",
};

export default function CennikPage() {
  return (
    <div className="flex flex-1 flex-col pb-24 md:pb-0">
      <SubpageHero>
        <h1 className="font-wedinfo-serif mt-6 text-3xl font-medium sm:mt-8 sm:text-4xl lg:text-5xl">
          Wybierz pakiet idealny dla Was
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
          Poznaj szczegóły pakietu podstawowego i indywidualnego — gdy będziecie gotowi, napiszcie do nas.
        </p>
      </SubpageHero>

      {pricingPlans.map((plan, index) => (
        <PricingPlanDetailSection key={plan.id} plan={plan} reversed={index % 2 === 1} />
      ))}

      <section className="bg-[var(--bg-dark)] py-16 text-center sm:py-20">
        <LandingSectionInner>
          <p className="font-wedinfo-serif text-2xl text-[var(--gold)] sm:text-3xl">
            Stwórzmy razem coś wyjątkowego
          </p>
          <p className="mt-3 text-sm text-white/55" aria-hidden>
            ♥
          </p>
          <Link href="/kontakt" className="btn-primary mt-8">
            Kontakt
          </Link>
        </LandingSectionInner>
      </section>
    </div>
  );
}
