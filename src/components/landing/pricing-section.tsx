"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PricingCardsGrid } from "@/components/pricing/pricing-sections";
import { pricingExtras, pricingPlans } from "@/data/pricing-plans";
import { LandingSectionInner } from "./landing-section-inner";

const pricingExtraIcons = {
  "Własna domena": (
    <svg viewBox="0 0 24 24" fill="none" className="size-8" stroke="currentColor" strokeWidth="1.15">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    </svg>
  ),
  "Aktualizacje w cenie": (
    <svg viewBox="0 0 24 24" fill="none" className="size-8" stroke="currentColor" strokeWidth="1.15">
      <path d="M4 4v5h5M20 20v-5h-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 9a8 8 0 00-14.5-2M4 15a8 8 0 0014.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
} as const;

export function PricingSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { rootMargin: "-8% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id="cennik"
      className={`scroll-mt-header relative z-[2] bg-white py-14 sm:py-20 ${visible ? "pricing-visible" : ""}`}
      aria-labelledby="pricing-heading"
    >
      <LandingSectionInner className="relative z-[2]">
        <h2
          id="pricing-heading"
          className="font-wedinfo-serif text-left text-3xl font-medium text-[var(--text-dark)] sm:text-4xl"
        >
          Prosty cennik
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,1fr)] lg:items-center lg:gap-12 xl:gap-16">
          <PricingCardsGrid plans={pricingPlans} animated />

          <aside className="pricing-extras flex flex-col justify-center border-t border-[var(--border-light)] pt-10 lg:border-t-0 lg:pt-0 lg:pl-6 xl:pl-10">
            <ul className="space-y-9 xl:space-y-10">
              {pricingExtras.map((item) => (
                <li key={item.title} className="flex gap-4 sm:gap-5">
                  <span className="mt-0.5 inline-flex shrink-0 text-[var(--gold)]" aria-hidden>
                    {pricingExtraIcons[item.title]}
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
            <div className="mt-9 border-t border-[var(--border-light)] pt-8 xl:mt-10">
              <p className="text-sm leading-relaxed text-[var(--text-dark)]">
                Sprawdź pełną ofertę i wybierz pakiet dopasowany do Was.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Link
                  href="/cennik"
                  className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--gold)] transition-opacity hover:opacity-80"
                >
                  Zobacz cennik →
                </Link>
                <Link
                  href="/kontakt?typ=individual"
                  className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-dark)] transition-opacity hover:opacity-70"
                >
                  Złóż zapytanie →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </LandingSectionInner>
    </section>
  );
}
