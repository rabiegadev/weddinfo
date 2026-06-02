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
    cta: { label: "Wybieram", href: "/kontakt?typ=basic", variant: "secondary" as const },
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
    cta: { label: "Wybieram", href: "/kontakt?typ=premium", variant: "primary" as const },
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
    cta: { label: "Kontakt", href: "/kontakt?typ=individual", variant: "secondary" as const },
  },
] as const;

const pricingExtras = [
  {
    title: "Własna domena",
    description: "Skorzystaj z naszych subdomen lub przedstaw swoją propozycję!",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-8" stroke="currentColor" strokeWidth="1.15">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
      </svg>
    ),
  },
  {
    title: "Aktualizacje w cenie",
    description:
      "Zmienił się świadek? A może podałeś zły numer telefonu? Takie poprawki realizujemy bez dodatkowych opłat.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-8" stroke="currentColor" strokeWidth="1.15">
        <path d="M4 4v5h5M20 20v-5h-5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 9a8 8 0 00-14.5-2M4 15a8 8 0 0014.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
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
      <LandingSectionInner className="relative z-[2]">
        <h2
          id="pricing-heading"
          className="font-wedinfo-serif text-left text-3xl font-medium text-[var(--text-dark)] sm:text-4xl"
        >
          Prosty cennik
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,1fr)] lg:items-center lg:gap-12 xl:gap-16">
          <ul className="grid gap-5 sm:gap-6 md:grid-cols-3 md:items-stretch">
            {plans.map((plan, index) => (
              <li
                key={plan.name}
                className="pricing-card"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <article
                  className={`relative flex h-full min-h-[420px] flex-col p-6 transition-transform duration-500 sm:p-7 ${
                    plan.highlighted
                      ? "pricing-card-highlight z-[1] border-2 border-[var(--gold)] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] lg:-translate-y-2 lg:pb-9"
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

          <aside className="pricing-extras flex flex-col justify-center border-t border-[var(--border-light)] pt-10 lg:border-t-0 lg:pt-0 lg:pl-6 xl:pl-10">
            <ul className="space-y-9 xl:space-y-10">
              {pricingExtras.map((item) => (
                <li key={item.title} className="flex gap-4 sm:gap-5">
                  <span className="mt-0.5 inline-flex shrink-0 text-[var(--gold)]" aria-hidden>
                    {item.icon}
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
                  href="/oferta"
                  className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--gold)] transition-opacity hover:opacity-80"
                >
                  Zobacz ofertę →
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
