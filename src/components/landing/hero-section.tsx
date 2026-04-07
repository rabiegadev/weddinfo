import Link from "next/link";
import { SectionDivider } from "./section-divider";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] flex-col justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
      {/* Duży znak w tle — obrączki */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(120vw,640px)] w-[min(120vw,640px)] -translate-x-1/2 -translate-y-[58%] opacity-[0.07]"
        aria-hidden
      >
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <circle cx="78" cy="100" r="52" stroke="#be123c" strokeWidth="1.2" />
          <circle cx="122" cy="100" r="52" stroke="#be123c" strokeWidth="1.2" />
          <path
            d="M100 28c-8 18-28 32-48 38 6 4 10 12 12 20 14-16 36-28 58-30-8-8-14-18-22-28z"
            fill="#881337"
            opacity="0.5"
          />
        </svg>
      </div>
      {/* Warm base wash */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-rose-50/90 via-amber-50/25 to-transparent"
        aria-hidden
      />
      {/* Soft rose glow orbs */}
      <div
        className="pointer-events-none absolute -left-1/4 top-0 h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full bg-rose-200/45 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[min(70vw,420px)] w-[min(70vw,420px)] rounded-full bg-amber-100/50 blur-3xl"
        aria-hidden
      />
      {/* White „mgłowe” warstwy */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/25 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[min(100%,48rem)] -translate-x-1/2 rounded-[100%] bg-white/50 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/60 to-transparent blur-xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <SectionDivider className="mb-5" />
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-rose-800/85">
          Wizytówka wesela
        </p>
        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl md:text-[2.75rem] md:leading-tight">
          Jedna strona ze wszystkim, co ważne dla gości
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-zinc-600">
          Harmonogram, dojazd, nocleg, RSVP — zbierz informacje w jednym miejscu.
          Spokojna, czytelna wizytówka pod adres w domenie Wedinfo, w zgodzie z
          ekosystemem Wedding Assistant.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
          <Link
            href="/zloz-zapytanie"
            className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-rose-800 px-8 text-sm font-semibold text-white shadow-lg shadow-rose-900/15 transition hover:bg-rose-900"
          >
            Złóż zapytanie
          </Link>
          <Link
            href="#realizacje"
            className="inline-flex h-12 items-center justify-center rounded-full border border-rose-200/80 bg-white/60 px-6 text-sm font-medium text-rose-900/90 backdrop-blur-sm transition hover:border-rose-300 hover:bg-white"
          >
            Zobacz przykłady
          </Link>
        </div>
        <p className="mt-5 max-w-md text-center text-sm text-zinc-500">
          Po wysłaniu formularza otrzymasz numer zapytania i link do statusu.
        </p>
      </div>
    </section>
  );
}
