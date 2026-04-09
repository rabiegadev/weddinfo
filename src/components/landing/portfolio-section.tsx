import Link from "next/link";
import { SectionDivider } from "./section-divider";

const examples = [
  {
    couple: "Kamila & Bartek",
    slug: "kamilaibartek",
    palette: "from-[var(--w-pink-dust)]/90 to-[var(--w-cream-a)]",
    accent: "text-[var(--w-gold-deep)]",
    date: "14 września",
  },
  {
    couple: "Ola & Michał",
    slug: "olaimichal",
    palette: "from-[var(--w-beige-b)] to-[var(--w-cream-b)]",
    accent: "text-[var(--foreground)]",
    date: "6 lipca",
  },
  {
    couple: "Natalia & Paweł",
    slug: "nataliaipawel",
    palette: "from-[var(--w-blush-b)]/80 to-[var(--w-mauve)]/25",
    accent: "text-[var(--w-mauve)]",
    date: "23 sierpnia",
  },
];

export function PortfolioSection() {
  return (
    <section
      id="realizacje"
      className="relative scroll-mt-20 border-t border-[var(--w-gold-deep)]/15 bg-white/35 px-4 py-20 backdrop-blur-[2px] sm:px-6"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        <SectionDivider className="w-[min(100%,24rem)]" />
        <h2 className="font-wedinfo-serif mt-5 text-center text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
          Przykładowe realizacje
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--foreground)]/70">
          Tak mogą wyglądać gotowe wizytówki — spójna typografia, harmonogram,
          mapa i sekcja dla gości. Poniżej wersje demonstracyjne (adresy przykładowe).
        </p>
        <GoldFlourishSmall className="mx-auto mt-8" />
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {examples.map((item) => (
            <article
              key={item.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--w-gold-deep)]/15 bg-white/70 shadow-sm shadow-[var(--w-gold-deep)]/8 transition hover:border-[var(--w-gold-deep)]/28 hover:shadow-md"
            >
              <div
                className={`relative h-36 bg-gradient-to-br ${item.palette} px-4 pt-6`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white/45 to-transparent" />
                <div className="relative flex items-start justify-between gap-2">
                  <div>
                    <p
                      className={`font-wedinfo-serif text-lg font-semibold italic ${item.accent}`}
                    >
                      {item.couple}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--foreground)]/50">
                      {item.date}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/75 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--foreground)]/50 backdrop-blur-sm">
                    Demo
                  </span>
                </div>
                <div className="relative mx-auto mt-4 h-14 w-[88%] rounded-t-lg border border-white/85 bg-white/92 px-3 pt-2 shadow-sm">
                  <div className="flex gap-1">
                    <span className="size-1.5 rounded-full bg-[var(--w-pink-dust)]" />
                    <span className="size-1.5 rounded-full bg-[var(--w-gold-soft-a)]/70" />
                    <span className="size-1.5 rounded-full bg-[var(--w-beige-b)]" />
                  </div>
                  <div className="mt-2 h-1.5 w-2/3 rounded bg-[var(--w-blush-a)]/60" />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <p className="text-xs text-[var(--foreground)]/55">
                  <span className="font-mono text-[var(--foreground)]/40">{item.slug}</span>
                  .weddinfo.pl
                </p>
                <p className="text-sm leading-relaxed text-[var(--foreground)]/72">
                  Spersonalizowane kolory, sekcja RSVP i prosty harmonogram dnia —
                  wszystko w jednej, lekkiej stronie.
                </p>
                <div className="mt-auto pt-2">
                  <span className="text-sm font-medium text-[var(--w-gold-deep)]/90">
                    Wkrótce podgląd na żywo
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-[var(--foreground)]/55">
          Chcesz podobną stronę?{" "}
          <Link
            href="/zloz-zapytanie"
            className="font-medium text-[var(--w-gold-deep)] underline-offset-2 hover:underline"
          >
            Wypełnij krótki brief
          </Link>
          .
        </p>
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
