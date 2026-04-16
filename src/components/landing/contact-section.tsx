import Link from "next/link";
import { SectionDivider } from "./section-divider";
import { SectionTexture } from "./section-texture";

export function ContactSection() {
  return (
    <section
      id="kontakt"
      className="scroll-mt-header relative overflow-hidden border-t border-[var(--w-gold-deep)]/18 bg-white/45 px-4 py-16 backdrop-blur-[1px] sm:px-6 sm:py-20"
    >
      <SectionTexture variant="pattern" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 z-[1] bg-gradient-to-b from-transparent via-white/80 to-[var(--w-blush-a)]/25"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionDivider className="w-[min(100%,24rem)]" />
        <h2 className="font-wedinfo-serif mt-5 text-center text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl">
          Kontakt
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[var(--foreground)]/70">
          Pytania o termin, domenę lub zakres — jedna wiadomość i wracamy z konkretami.
        </p>
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--w-gold-deep)]/18 bg-gradient-to-br from-[var(--w-pink-dust)]/35 to-white/90 p-6 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--w-gold-deep)]">
              Zapytanie o stronę
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/72">
              Formularz = numer referencyjny + link do statusu w jednym kroku.
            </p>
            <Link
              href="/zloz-zapytanie"
              className="touch-manipulation mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--w-gold-deep)] to-[var(--w-gold-soft-b)] px-5 py-3 text-base font-semibold text-white hover:brightness-105 active:brightness-95 sm:w-auto sm:text-sm [-webkit-tap-highlight-color:transparent]"
            >
              Przejdź do formularza
            </Link>
          </div>
          <div className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--w-beige-b)]/60 p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]/65">
              Autor rozwiązania
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/72">
              Rozwój:{" "}
              <a
                href="https://rabiegadevelopment.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--w-gold-deep)] underline-offset-2 hover:underline"
              >
                rabiegadevelopment.pl
              </a>{" "}
              — więcej realizacji i bezpośredni kontakt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
