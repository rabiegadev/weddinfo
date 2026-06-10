import type { Metadata } from "next";
import Link from "next/link";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";
import { SubpageHero } from "@/components/subpage-hero";
import {
  PricingCardsGrid,
  PricingPlanDetailSection,
  PricingScrollDivider,
} from "@/components/pricing/pricing-sections";
import { pricingExtras, pricingPlans } from "@/data/pricing-plans";

export const metadata: Metadata = {
  title: "Cennik",
  description:
    "Pakiety Weddinfo: Podstawowy, Premium i Indywidual. Porównaj zakres usług i wybierz wizytówkę weselną dopasowaną do Was.",
};

function PricingExtrasIcons() {
  return (
    <ul className="space-y-9 xl:space-y-10">
      {pricingExtras.map((item) => (
        <li key={item.title} className="flex gap-4 sm:gap-5">
          <span className="mt-0.5 inline-flex shrink-0 text-[var(--gold)]" aria-hidden>
            {item.title === "Własna domena" ? (
              <svg viewBox="0 0 24 24" fill="none" className="size-8" stroke="currentColor" strokeWidth="1.15">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="size-8" stroke="currentColor" strokeWidth="1.15">
                <path d="M4 4v5h5M20 20v-5h-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 9a8 8 0 00-14.5-2M4 15a8 8 0 0014.5 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-dark)]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function CennikPage() {
  const availablePlans = pricingPlans.filter((plan) => !plan.unavailable);

  return (
    <div className="flex flex-1 flex-col pb-24 md:pb-0">
      <SubpageHero>
        <h1 className="font-wedinfo-serif mt-6 text-3xl font-medium sm:mt-8 sm:text-4xl lg:text-5xl">
          Wybierz pakiet idealny dla Was
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
          Porównaj zakres usług, zobacz szczegóły każdego pakietu i przejdź do formularza, gdy będziecie gotowi.
        </p>
      </SubpageHero>

      <section className="bg-white py-14 sm:py-20" aria-labelledby="cennik-overview-heading">
        <LandingSectionInner>
          <h2 id="cennik-overview-heading" className="sr-only">
            Przegląd pakietów
          </h2>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,1fr)] lg:items-center lg:gap-12 xl:gap-16">
            <PricingCardsGrid plans={pricingPlans} />
            <aside className="flex flex-col justify-center border-t border-[var(--border-light)] pt-10 lg:border-t-0 lg:pt-0 lg:pl-6 xl:pl-10">
              <PricingExtrasIcons />
              <div className="mt-9 border-t border-[var(--border-light)] pt-8 xl:mt-10">
                <p className="text-sm leading-relaxed text-[var(--text-dark)]">
                  Masz pytania lub nietypowe potrzeby? Napisz — pomożemy dobrać właściwy pakiet.
                </p>
                <Link
                  href="/kontakt?typ=individual"
                  className="mt-4 inline-block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--gold)] transition-opacity hover:opacity-80"
                >
                  Złóż zapytanie →
                </Link>
              </div>
            </aside>
          </div>
        </LandingSectionInner>
      </section>

      <PricingScrollDivider />

      {availablePlans.map((plan, index) => (
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
