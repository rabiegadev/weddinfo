import type { ReactNode } from "react";
import { LandingSectionInner } from "./landing-section-inner";

function BenefitIcon({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex size-9 items-center justify-center text-[var(--gold)] sm:size-10" aria-hidden>
      {children}
    </span>
  );
}

const benefits = [
  {
    label: "Indywidualny projekt",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-7 sm:size-8" stroke="currentColor" strokeWidth="1.25">
        <path d="M4 20h16M6 16l3-9 3 5 3-7 3 11" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Własna domena",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-7 sm:size-8" stroke="currentColor" strokeWidth="1.25">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
      </svg>
    ),
  },
  {
    label: "Szybka realizacja",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-7 sm:size-8" stroke="currentColor" strokeWidth="1.25">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Wsparcie na każdym etapie",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-7 sm:size-8" stroke="currentColor" strokeWidth="1.25">
        <path d="M4 14v3a2 2 0 002 2h1l2 3 2-6 2-6 2 3 2-3h1a2 2 0 002-2v-3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 10a4 4 0 118 0v1H8v-1z" />
      </svg>
    ),
  },
] as const;

export function BenefitsSection() {
  return (
    <section
      id="korzysci"
      className="scroll-mt-header border-y border-[var(--border-light)] bg-[var(--bg-light)] py-6 sm:py-8"
      aria-label="Korzyści"
    >
      <LandingSectionInner>
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
          {benefits.map((item) => (
            <li key={item.label} className="flex flex-col items-center text-center">
              <BenefitIcon>{item.icon}</BenefitIcon>
              <p className="mt-2 max-w-[10rem] text-[10px] font-semibold uppercase leading-snug tracking-[0.14em] text-[var(--text-dark)] sm:max-w-none sm:text-[11px]">
                {item.label}
              </p>
            </li>
          ))}
        </ul>
      </LandingSectionInner>
    </section>
  );
}
