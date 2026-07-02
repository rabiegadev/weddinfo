import type { Metadata } from "next";
import Link from "next/link";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";
import { SubpageHero } from "@/components/subpage-hero";
import { PortfolioExampleCard } from "@/components/landing/portfolio-example-card";
import { portfolioExamples } from "@/data/portfolio-examples";

export const metadata: Metadata = {
  title: "Realizacje",
  description:
    "Przykładowe wizytówki weselne Weddinfo — szablony, kolorystyka, harmonogram i RSVP w jednym miejscu.",
};

export default function RealizacjePage() {
  const featured = portfolioExamples.filter((item) => item.badge === "live");
  const more = portfolioExamples.filter((item) => item.badge !== "live");

  return (
    <div className="flex flex-1 flex-col pb-24 md:pb-0">
      <SubpageHero>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)] sm:mt-8">Portfolio</p>
        <h1 className="font-wedinfo-serif mt-4 text-3xl font-medium sm:text-4xl lg:text-5xl">
          Przykładowe projekty stron
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
          Zobacz przykładowe wizytówki — od gotowych szablonów po dopasowane projekty. Każda strona działa na
          telefonie i komputerze.
        </p>
      </SubpageHero>

      {featured.length > 0 ? (
        <section className="bg-white py-14 sm:py-20" aria-labelledby="realizacje-featured-heading">
          <LandingSectionInner>
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="realizacje-featured-heading"
                className="font-wedinfo-serif text-2xl font-medium text-[var(--text-dark)] sm:text-3xl"
              >
                Na żywo — podgląd
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                Działające przykłady z pełnym zakresem sekcji: harmonogram, potwierdzenie obecności, dojazd i kontakt.
              </p>
            </div>
            <ul className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {featured.map((item) => (
                <li key={item.slug}>
                  <PortfolioExampleCard item={item} featured />
                </li>
              ))}
            </ul>
          </LandingSectionInner>
        </section>
      ) : null}

      {more.length > 0 ? (
        <section
          className="border-t border-[var(--border-light)] bg-[var(--bg-light)]/30 py-14 sm:py-20"
          aria-labelledby="realizacje-more-heading"
        >
          <LandingSectionInner>
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="realizacje-more-heading"
                className="font-wedinfo-serif text-2xl font-medium text-[var(--text-dark)] sm:text-3xl"
              >
                Więcej przykładów
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                Kolejne szablony i style — wkrótce z podglądem na żywo.
              </p>
            </div>
            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((item) => (
                <li key={item.slug}>
                  <PortfolioExampleCard item={item} />
                </li>
              ))}
            </ul>
          </LandingSectionInner>
        </section>
      ) : null}

      <section className="bg-[var(--bg-dark)] py-16 text-center sm:py-20">
        <LandingSectionInner>
          <p className="font-wedinfo-serif text-2xl text-[var(--gold)] sm:text-3xl">
            Chcecie podobną stronę?
          </p>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/55">
            Napisz do nas — chętnie opowiemy o pakietach i dopasujemy projekt do Waszego stylu.
          </p>
          <Link href="/kontakt" className="btn-primary mt-8 min-w-[200px]">
            Złóż zapytanie
          </Link>
        </LandingSectionInner>
      </section>
    </div>
  );
}
