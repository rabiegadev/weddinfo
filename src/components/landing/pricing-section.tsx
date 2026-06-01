"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LandingSectionInner } from "./landing-section-inner";

const plans = [
  {
    name: "Start",
    price: "149 zł",
    features: [
      "Strona z szablonu",
      "Harmonogram dnia",
      "RSVP",
      "Dojazd",
      "Kontakt",
    ],
    highlighted: false,
    cta: { label: "Wybieram", href: "/zloz-zapytanie", variant: "secondary" as const },
  },
  {
    name: "Premium",
    price: "299 zł",
    features: [
      "Wszystko z pakietu Start",
      "Indywidualne kolory",
      "Własna domena",
      "Noclegi",
      "Galeria zdjęć",
    ],
    highlighted: true,
    cta: { label: "Wybieram", href: "/zloz-zapytanie", variant: "primary" as const },
  },
  {
    name: "Indywidual",
    price: "od 599 zł",
    features: [
      "Projekt od zera",
      "Pełna personalizacja",
      "Dodatkowe sekcje",
      "Zaawansowane funkcje",
      "Priorytetowa realizacja",
    ],
    highlighted: false,
    cta: { label: "Kontakt", href: "/zloz-zapytanie", variant: "secondary" as const },
  },
] as const;

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
      <LandingSectionInner className="relative z-[2] lg:pr-[min(34vw,400px)]">
        <h2
          id="pricing-heading"
          className="font-wedinfo-serif text-left text-3xl font-medium text-[var(--text-dark)] sm:text-4xl"
        >
          Prosty cennik
        </h2>

        <ul className="mt-12 grid gap-6 md:grid-cols-3 md:items-stretch">
          {plans.map((plan, index) => (
            <li
              key={plan.name}
              className="pricing-card"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <article
                className={`relative flex h-full min-h-[420px] flex-col p-6 transition-transform duration-500 sm:p-8 ${
                  plan.highlighted
                    ? "pricing-card-highlight border-2 border-[var(--gold)] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                    : "border border-[var(--border-light)] bg-white"
                }`}
              >
                {plan.highlighted ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--gold)] px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white whitespace-nowrap">
                    Najpopularniejszy
                  </span>
                ) : null}
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                  {plan.name}
                </h3>
                <p className="font-wedinfo-serif mt-3 text-3xl text-[var(--text-dark)]">{plan.price}</p>
                <ul className="mt-6 flex-1 space-y-3 border-t border-[var(--border-light)] pt-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-[var(--text-dark)]">
                      <span className="shrink-0 text-[var(--gold)]" aria-hidden>
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.cta.href}
                  className={`mt-8 w-full whitespace-nowrap ${
                    plan.cta.variant === "primary" ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {plan.cta.label}
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </LandingSectionInner>
    </section>
  );
}
