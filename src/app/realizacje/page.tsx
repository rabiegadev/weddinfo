import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioExampleCard } from "@/components/landing/portfolio-example-card";
import { SectionDivider } from "@/components/landing/section-divider";
import { SectionTexture } from "@/components/landing/section-texture";
import { portfolioExamples } from "@/data/portfolio-examples";

export const metadata: Metadata = {
  title: "Realizacje",
  description:
    "Katalog przykładowych wizytówek weselnych: kolorystyka, harmonogram i RSVP w jednym miejscu.",
};

export default function RealizacjePage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-[var(--w-cream-b)] via-white/40 to-[var(--w-cream-a)]">
      <SectionTexture variant="pattern" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-white/80 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm text-[var(--foreground)]/65">
          <Link
            href="/#realizacje"
            className="text-[var(--w-gold-deep)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
          >
            ← Wróć na stronę główną
          </Link>
        </p>
        <header className="mt-8 text-center">
          <SectionDivider className="mx-auto w-[min(100%,24rem)]" />
          <h1 className="font-wedinfo-serif mt-5 text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Realizacje
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-[var(--foreground)]/72 sm:text-base">
            Szerszy wybór przykładowych szablonów i stylów — ta sama idea co na stronie głównej: spójny
            wygląd, jasne informacje i lekki podgląd na urządzeniach mobilnych.
          </p>
        </header>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioExamples.map((item) => (
            <PortfolioExampleCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
