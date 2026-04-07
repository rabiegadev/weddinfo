import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-rose-900/10 bg-white/80 backdrop-blur-md dark:bg-zinc-950/80 dark:border-rose-100/10">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-semibold tracking-tight text-rose-950 dark:text-rose-50"
        >
          Wedinfo
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/zloz-zapytanie"
            className="text-zinc-600 hover:text-rose-900 dark:text-zinc-400 dark:hover:text-rose-100"
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
