import Link from "next/link";
import { portfolioFeatured } from "@/data/portfolio-examples";
import { PortfolioExampleCard } from "./portfolio-example-card";
import { SectionDivider } from "./section-divider";
import { SectionTexture } from "./section-texture";

export function PortfolioSection() {
  return (
    <section
      id="realizacje"
      className="scroll-mt-header relative overflow-hidden border-t border-[var(--w-gold-deep)]/15 bg-white/30 px-4 py-16 backdrop-blur-[2px] sm:px-6 sm:py-20"
    >
      <SectionTexture variant="pattern" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionDivider className="w-[min(100%,24rem)]" />
        <h2 className="font-wedinfo-serif mt-5 text-balance text-center text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl">
          Przykładowe realizacje
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-pretty text-center text-sm leading-relaxed text-[var(--foreground)]/72 sm:text-base">
          Tak może wyglądać Twoja strona weselna — spójna, w dopasowanej kolorystyce i designie oraz ze
          spersonalizowanymi zdjęciami, informacjami i odliczaniem do najważniejszego dnia.
        </p>
        <GoldFlourishSmall className="mx-auto mt-8" />
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {portfolioFeatured.map((item) => (
            <PortfolioExampleCard key={item.slug} item={item} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            href="/realizacje"
            className="group relative inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 overflow-hidden rounded-md border border-black/10 px-7 py-2.5 text-sm font-medium tracking-wide text-[#f4ebe2] shadow-sm transition hover:border-black/15 hover:brightness-[1.05] active:brightness-95 [-webkit-tap-highlight-color:transparent]"
            style={{
              backgroundColor: "#3d3028",
              backgroundImage: `
                repeating-linear-gradient(
                  -32deg,
                  transparent,
                  transparent 5px,
                  rgba(255,255,255,0.045) 5px,
                  rgba(255,255,255,0.045) 6px
                ),
                radial-gradient(ellipse 120% 80% at 50% 0%, rgba(255,255,255,0.08), transparent 55%)
              `,
            }}
          >
            <span
              className="font-wedinfo-serif text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#d4c4b4]/90"
              aria-hidden
            >
              ◆
            </span>
            Więcej realizacji
            <span
              className="font-wedinfo-serif text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#d4c4b4]/90"
              aria-hidden
            >
              ◆
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function GoldFlourishSmall({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-32 text-[var(--w-gold-deep)] opacity-70 ${className}`}
      viewBox="0 0 160 12"
      fill="none"
      aria-hidden
    >
      <line x1="0" y1="6" x2="68" y2="6" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" opacity="0.6" />
      <line x1="160" y1="6" x2="92" y2="6" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" opacity="0.6" />
      <circle cx="80" cy="6" r="2" fill="currentColor" opacity="0.45" />
    </svg>
  );
}
