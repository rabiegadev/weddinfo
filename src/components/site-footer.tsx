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
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <WedinfoLogo variant="light" size="md" className="select-none" />
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#c8bfb5]">
              Strony pod wesele: harmonogram dnia, informacje dla gości i
              potwierdzenie obecności — przygotowane tak, by Para i zaproszeni
              mieli jasny, wspólny punkt odniesienia w sieci.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Link href="/zloz-zapytanie" className="transition hover:text-white">
              Złóż zapytanie
            </Link>
            <Link href="/#realizacje" className="transition hover:text-white">
              Realizacje
            </Link>
            <Link href="/#opinie" className="transition hover:text-white">
              Opinie
            </Link>
            <Link href="/#kontakt" className="transition hover:text-white">
              Kontakt
            </Link>
            <Link href="/admin/login" className="text-[#9a9088] transition hover:text-[#e8dfd4]">
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
