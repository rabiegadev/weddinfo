import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-rose-900/10 bg-zinc-900 text-zinc-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-semibold tracking-tight text-white">Wedinfo</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">
              Wizytówki weselne — harmonogram, RSVP i wszystko, co ważne dla gości,
              w jednym spokojnym miejscu.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Link href="/zloz-zapytanie" className="hover:text-white">
              Złóż zapytanie
            </Link>
            <Link href="/#realizacje" className="hover:text-white">
              Realizacje
            </Link>
            <Link href="/#opinie" className="hover:text-white">
              Opinie
            </Link>
            <Link href="/#kontakt" className="hover:text-white">
              Kontakt
            </Link>
            <Link href="/admin/login" className="text-zinc-500 hover:text-zinc-300">
              Panel
            </Link>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-zinc-800 pt-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Wedinfo. Wszelkie prawa zastrzeżone.
          </p>
          <p>
            Realizacja:{" "}
            <a
              href="https://rabiegadevelopment.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-300/90 underline-offset-2 hover:text-rose-200 hover:underline"
            >
              rabiegadevelopment.pl
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
