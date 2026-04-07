import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard — Wedinfo",
};

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Zgłoszenia
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Lista zapytań i odpowiedzi — po podłączeniu autoryzacji administratora.
          </p>
        </div>
        <Link
          href="/admin/login"
          className="text-sm font-medium text-rose-800 hover:underline dark:text-rose-200"
        >
          Logowanie
        </Link>
      </header>
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
        Tabela zapytań (nowe / w toku / zamknięte) pojawi się tutaj po migracji
        bazy i ochronie tras <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">/admin</code>.
      </div>
    </div>
  );
}
