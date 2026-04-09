import Link from "next/link";
import { WedinfoLogo } from "@/components/wedinfo-logo";

export function SiteFooter() {
  return (
    <footer
      className="border-t border-[var(--w-gold-deep)]/25 text-[#e8dfd4]"
      style={{
        background: "linear-gradient(180deg, #2e2822 0%, #1a1614 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-[calc(3rem+env(safe-area-inset-bottom,0px))] sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <WedinfoLogo variant="light" size="md" className="select-none" />
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#c8bfb5]">
              Strony pod wesele: harmonogram dnia, informacje dla gości i
              potwierdzenie obecności — przygotowane tak, by Para i zaproszeni
              mieli jasny, wspólny punkt odniesienia w sieci.
            </p>
          </div>
          <nav className="flex flex-col gap-1 text-sm sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2">
            <Link
              href="/zloz-zapytanie"
              className="touch-manipulation inline-flex min-h-11 items-center rounded-lg py-2 transition hover:text-white [-webkit-tap-highlight-color:transparent] sm:min-h-0 sm:py-0"
            >
              Złóż zapytanie
            </Link>
            <Link
              href="/#realizacje"
              className="touch-manipulation inline-flex min-h-11 items-center rounded-lg py-2 transition hover:text-white [-webkit-tap-highlight-color:transparent] sm:min-h-0 sm:py-0"
            >
              Realizacje
            </Link>
            <Link
              href="/#opinie"
              className="touch-manipulation inline-flex min-h-11 items-center rounded-lg py-2 transition hover:text-white [-webkit-tap-highlight-color:transparent] sm:min-h-0 sm:py-0"
            >
              Opinie
            </Link>
            <Link
              href="/#kontakt"
              className="touch-manipulation inline-flex min-h-11 items-center rounded-lg py-2 transition hover:text-white [-webkit-tap-highlight-color:transparent] sm:min-h-0 sm:py-0"
            >
              Kontakt
            </Link>
            <Link
              href="/admin/login"
              className="touch-manipulation inline-flex min-h-11 items-center rounded-lg py-2 text-[#9a9088] transition hover:text-[#e8dfd4] [-webkit-tap-highlight-color:transparent] sm:min-h-0 sm:py-0"
            >
              Panel
            </Link>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--w-gold-deep)]/15 pt-8 text-sm text-[#9a9088] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Weddinfo. Wszelkie prawa zastrzeżone.</p>
          <p>
            Realizacja:{" "}
            <a
              href="https://rabiegadevelopment.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--w-gold-soft-b)] underline-offset-2 transition hover:text-[var(--w-gold-shine)] hover:underline"
            >
              rabiegadevelopment.pl
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
