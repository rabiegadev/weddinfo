import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100/90 via-amber-50/40 to-transparent dark:from-rose-950/50 dark:via-zinc-950 dark:to-zinc-950"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-800/80 dark:text-rose-200/80">
            Wizytówka wesela
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Jedna strona ze wszystkim, co ważne dla gości
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Harmonogram, dojazd, nocleg, RSVP — zbierz informacje w jednym miejscu.
            To część ekosystemu Wedding Assistant: tutaj tworzysz tylko spokojną,
            czytelną wizytówkę pod Wasz dzień.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/zloz-zapytanie"
              className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-rose-800 px-8 text-sm font-semibold text-white shadow-md transition hover:bg-rose-900 dark:bg-rose-700 dark:hover:bg-rose-600"
            >
              Złóż zapytanie
            </Link>
            <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-500">
              Po wysłaniu formularza otrzymasz numer zapytania i link do statusu.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
