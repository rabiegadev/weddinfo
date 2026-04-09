import Link from "next/link";
import { SectionDivider } from "./section-divider";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[78vh] flex-col justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(110vw,560px)] w-[min(110vw,560px)] -translate-x-1/2 -translate-y-[55%] opacity-[0.09]"
        aria-hidden
      >
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <circle cx="78" cy="100" r="52" stroke="var(--w-gold-deep)" strokeWidth="1.2" />
          <circle cx="122" cy="100" r="52" stroke="var(--w-gold-soft-b)" strokeWidth="1.2" />
          <path
            d="M100 28c-8 18-28 32-48 38 6 4 10 12 12 20 14-16 36-28 58-30-8-8-14-18-22-28z"
            fill="var(--w-mauve)"
            opacity="0.35"
          />
        </svg>
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/75 via-[var(--w-cream-a)]/40 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-1/4 top-0 h-[min(85vw,480px)] w-[min(85vw,480px)] rounded-full bg-[var(--w-pink-dust)]/35 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[min(70vw,400px)] w-[min(70vw,400px)] rounded-full bg-[var(--w-gold-soft-a)]/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/55 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <SectionDivider className="mb-5 w-[min(100%,22rem)]" />
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--w-gold-deep)] sm:text-sm">
          Wizytówka wesela
        </p>
        <h1 className="font-wedinfo-serif mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight text-[var(--foreground)] sm:text-5xl md:text-[2.85rem]">
          Jedna strona ze wszystkim, co ważne dla gości
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-[var(--foreground)]/72">
          Harmonogram, dojazd, nocleg, RSVP — zbierz informacje w jednym miejscu.
          Spokojna, czytelna wizytówka pod adresem w domenie Weddinfo, w zgodzie z
          ekosystemem Wedding Assistant.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
          <Link
            href="/zloz-zapytanie"
            className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-gradient-to-r from-[var(--w-gold-deep)] to-[var(--w-gold-soft-b)] px-8 text-sm font-semibold text-white shadow-lg shadow-[var(--w-gold-deep)]/20 transition hover:brightness-105"
          >
            Złóż zapytanie
          </Link>
          <Link
            href="#realizacje"
            className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--w-gold-deep)]/35 bg-white/65 px-6 text-sm font-medium text-[var(--w-gold-deep)] backdrop-blur-sm transition hover:border-[var(--w-gold-deep)]/55 hover:bg-white"
          >
            Zobacz przykłady
          </Link>
        </div>
        <p className="mt-5 max-w-md text-center text-sm text-[var(--foreground)]/55">
          Po wysłaniu formularza otrzymasz numer zapytania i link do statusu.
        </p>
      </div>
    </section>
  );
}
