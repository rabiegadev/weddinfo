import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-rose-900/10 bg-white/85 backdrop-blur-md dark:bg-zinc-950/80 dark:border-rose-100/10">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 font-semibold tracking-tight text-rose-950 dark:text-rose-50"
        >
          Wedinfo
        </Link>
        <nav className="flex max-w-[min(100%,28rem)] flex-wrap items-center justify-end gap-x-2.5 gap-y-1 text-xs sm:max-w-none sm:gap-x-4 sm:text-sm">
          <Link
            href="/#realizacje"
            className="text-zinc-600 hover:text-rose-900 dark:text-zinc-400 dark:hover:text-rose-100"
          >
            Realizacje
          </Link>
          <Link
            href="/#opinie"
            className="text-zinc-600 hover:text-rose-900 dark:text-zinc-400 dark:hover:text-rose-100"
          >
            Opinie
          </Link>
          <Link
            href="/#kontakt"
            className="text-zinc-600 hover:text-rose-900 dark:text-zinc-400 dark:hover:text-rose-100"
          >
            Kontakt
          </Link>
          <Link
            href="/zloz-zapytanie"
            className="font-medium text-rose-900 hover:text-rose-950 dark:text-rose-200 dark:hover:text-rose-100"
          >
            Złóż zapytanie
          </Link>
          <Link
            href="/admin/login"
            className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
          >
            Panel
          </Link>
        </nav>
      </div>
    </header>
  );
}
