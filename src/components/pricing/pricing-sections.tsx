import Link from "next/link";
import {
  pricingContactHref,
  pricingPlanAnchor,
  type PricingPlan,
} from "@/data/pricing-plans";

type PricingCardsGridProps = {
  plans: readonly PricingPlan[];
  /** Animacja wejścia z landing page */
  animated?: boolean;
};

export function PricingCardsGrid({ plans, animated = false }: PricingCardsGridProps) {
  return (
    <ul className="grid gap-5 sm:gap-6 md:grid-cols-3 md:items-stretch">
      {plans.map((plan, index) => (
        <li
          key={plan.id}
          className={animated ? "pricing-card flex h-full" : "flex h-full"}
          style={animated ? { animationDelay: `${index * 0.12}s` } : undefined}
        >
          <article
            className={`relative flex h-full w-full min-h-[440px] flex-col p-6 sm:p-7 ${
              plan.highlighted
                ? "pricing-card-highlight z-[1] border-2 border-[var(--gold)] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                : "border border-[var(--border-light)] bg-white"
            } ${plan.unavailable ? "pricing-card-unavailable" : ""}`}
            aria-disabled={plan.unavailable ? true : undefined}
          >
            {plan.unavailable ? (
              <div
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-white/55 p-6 backdrop-blur-[2px]"
                aria-hidden
              >
                <p className="max-w-[12rem] border border-[var(--border-light)] bg-white/90 px-4 py-3 text-center text-[10px] font-semibold uppercase leading-relaxed tracking-[0.16em] text-[var(--text-muted)] shadow-sm">
                  Na razie niedostępny
                </p>
              </div>
            ) : null}
            <div
              className={`flex min-h-0 flex-1 flex-col ${plan.unavailable ? "opacity-45 blur-[3px] select-none" : ""}`}
            >
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                {plan.name}
              </h3>
              <p className="font-wedinfo-serif mt-3 text-3xl text-[var(--text-dark)]">{plan.price}</p>
              <ul className="mt-6 flex-1 space-y-3 border-t border-[var(--border-light)] pt-6">
                {plan.overviewFeatures.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-[var(--text-dark)]">
                    <span className="shrink-0 text-[var(--gold)]" aria-hidden>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-8 shrink-0">
                {plan.unavailable ? (
                  <span
                    className="btn-secondary block w-full cursor-not-allowed text-center whitespace-nowrap opacity-60"
                    aria-disabled="true"
                  >
                    Wybieram →
                  </span>
                ) : (
                  <Link
                    href={pricingPlanAnchor(plan.id)}
                    className={`block w-full text-center whitespace-nowrap ${
                      plan.highlighted ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    Wybieram →
                  </Link>
                )}
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

type PricingPlanDetailSectionProps = {
  plan: PricingPlan;
  reversed?: boolean;
};

function DetailIcon({ index }: { index: number }) {
  const paths = [
    "M4 20h16M6 16l3-9 3 5 3-7 3 11",
    "M12 3c2.5 3 2.5 15 0 18M3 12h18",
    "M7 4h10v16H7zM10 8h4",
    "M5 12h14M12 5v14",
    "M4 16l4-8 4 5 4-9 4 12",
    "M12 8v8M8 12h8",
  ];
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-7 text-[var(--gold)]" stroke="currentColor" strokeWidth="1.15">
      <path d={paths[index % paths.length]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PricingPlanDetailSection({ plan, reversed = false }: PricingPlanDetailSectionProps) {
  const contactHref = pricingContactHref(plan.contactTyp);

  return (
    <section
      id={plan.id}
      className="scroll-mt-header border-t border-[var(--border-light)] bg-[var(--bg-white)] py-16 sm:py-20"
      aria-labelledby={`plan-${plan.id}-heading`}
    >
      <div
        className={`mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 md:px-12 lg:grid-cols-[1fr_minmax(280px,340px)] lg:items-start lg:gap-16 xl:px-20 ${
          reversed ? "lg:[direction:rtl]" : ""
        }`}
      >
        <div className={reversed ? "lg:[direction:ltr]" : ""}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Pakiet {plan.name}
          </p>
          <h2
            id={`plan-${plan.id}-heading`}
            className="font-wedinfo-serif mt-3 text-3xl font-medium text-[var(--text-dark)] sm:text-4xl lg:text-[2.75rem]"
          >
            Pakiet{" "}
            <span className="text-[var(--gold)]">{plan.name}</span>
          </h2>
          <p className="mt-4 max-w-xl text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {plan.tagline}
          </p>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2">
            {plan.detailFeatures.map((feature, index) => (
              <li key={feature.title} className="flex gap-4">
                <span className="mt-0.5 shrink-0" aria-hidden>
                  <DetailIcon index={index} />
                </span>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-dark)]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className={`lg:sticky lg:top-28 ${reversed ? "lg:[direction:ltr]" : ""}`}>
          <div className="border border-[var(--border-light)] bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.06)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">{plan.name}</p>
            <p className="font-wedinfo-serif mt-3 text-4xl text-[var(--text-dark)]">{plan.price}</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{plan.priceNote}</p>
            {plan.unavailable ? (
              <p className="mt-6 rounded border border-[var(--border-light)] bg-[var(--bg-light)] px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Na razie niedostępny
              </p>
            ) : (
              <Link href={contactHref} className="btn-primary mt-8 block w-full text-center">
                Wybieram ten pakiet
              </Link>
            )}
            <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-[var(--text-muted)]">
              <span aria-hidden>🛡</span>
              Bez ukrytych opłat i dodatkowych kosztów
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function PricingScrollDivider() {
  return (
    <div className="flex justify-center border-t border-[var(--border-light)] bg-[var(--bg-light)] py-8">
      <span className="hero-scroll-arrow inline-flex text-[var(--gold)]" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" className="size-6" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}
