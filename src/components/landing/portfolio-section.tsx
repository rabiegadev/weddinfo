import Image from "next/image";
import Link from "next/link";
import type { PortfolioExample } from "@/data/portfolio-examples";
import { portfolioExamples } from "@/data/portfolio-examples";
import { LandingSectionInner } from "./landing-section-inner";

const landingPortfolioItems = portfolioExamples.slice(0, 4);

const defaultFeatures = ["RSVP", "Harmonogram", "Kontakt"];

function LandingPortfolioCard({ item }: { item: PortfolioExample }) {
  const features = item.featureHighlights ?? defaultFeatures;
  const styleLabel = item.styleLabel ?? "Spersonalizowany szablon";

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-white/10 bg-[#141414] transition hover:border-[var(--gold)]/35">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1a1a1a]">
        {item.screenshotSrc ? (
          <Image
            src={item.screenshotSrc}
            alt={`Realizacja — ${item.couple}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${item.palette} px-5 pt-6`}>
            <p className={`font-wedinfo-serif text-lg font-medium ${item.accent}`}>{item.couple}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {item.date}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="font-wedinfo-serif text-lg text-white sm:text-xl">{item.couple}</p>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--gold)] sm:text-xs">
          {styleLabel}
        </p>
        <p className="mt-3 text-[11px] leading-relaxed text-white/45 sm:text-xs">
          {features.join(" • ")}
        </p>
        {item.liveUrl ? (
          <Link
            href={item.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--gold)] transition hover:text-white sm:text-xs"
          >
            Zobacz realizację
            <span aria-hidden>→</span>
          </Link>
        ) : (
          <span className="mt-auto pt-4 text-[11px] text-white/35 sm:text-xs">Podgląd wkrótce</span>
        )}
      </div>
    </article>
  );
}

export function PortfolioSection() {
  return (
    <section
      id="realizacje"
      className="scroll-mt-header landing-dots-dark relative bg-[var(--bg-dark)] pt-16 pb-14 sm:pt-24 sm:pb-16"
      aria-labelledby="portfolio-heading"
    >
      <LandingSectionInner className="relative z-[1]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)] sm:text-sm">
          Portfolio
        </p>
        <h2
          id="portfolio-heading"
          className="font-wedinfo-serif mt-2 text-left text-3xl font-medium text-white sm:mt-3 sm:text-4xl"
        >
          Zobacz nasze realizacje
        </h2>
        <p className="mt-4 max-w-2xl text-left text-sm leading-relaxed text-white/65 sm:text-base">
          Spójne wizytówki w dopasowanej kolorystyce — harmonogram, RSVP, dojazd i galeria w jednym
          miejscu.
        </p>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {landingPortfolioItems.map((item) => (
            <li key={item.slug} className="min-w-0">
              <LandingPortfolioCard item={item} />
            </li>
          ))}
        </ul>

        <div className="mt-14 flex justify-center">
          <Link href="/realizacje" className="btn-secondary min-w-[240px] px-8">
            Zobacz wszystkie realizacje
          </Link>
        </div>
      </LandingSectionInner>
    </section>
  );
}
