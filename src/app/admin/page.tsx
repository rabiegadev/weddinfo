import type { Metadata } from "next";
import Link from "next/link";
import { listInquiriesForAdmin } from "@/data/inquiries";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Dashboard — Weddinfo",
};

function statusLabel(s: string) {
  switch (s) {
    case "new":
      return "Nowe";
    case "in_progress":
      return "W toku";
    case "closed":
      return "Zamknięte";
    default:
      return s;
  }
}

export default async function AdminDashboardPage() {
  await requireAdminSession();
  const rows = await listInquiriesForAdmin();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Zgłoszenia
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {rows.length === 0
              ? "Brak zapisanych zapytań."
              : `Łącznie: ${rows.length}.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/admin/logout"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Wyloguj
          </Link>
          <Link
            href="/"
            className="font-medium text-rose-800 hover:underline dark:text-rose-200"
          >
            Strona główna
          </Link>
        </div>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
          Gdy para złoży zapytanie przez formularz, pojawi się tutaj wpis z linkiem
          do szczegółów.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/60">
                <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                  ID
                </th>
                <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                  Para
                </th>
                <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                  Data wesela
                </th>
                <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                  Utworzono
                </th>
                <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                >
                  <td className="px-4 py-3 font-mono text-xs text-rose-800 dark:text-rose-200">
                    {r.publicId}
                  </td>
                  <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                    {r.partner1FirstName} {r.partner1LastName} &{" "}
                    {r.partner2FirstName} {r.partner2LastName}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {r.weddingDate ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {statusLabel(r.status)}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Intl.DateTimeFormat("pl-PL", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(r.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/zapytanie/${encodeURIComponent(r.publicId)}`}
                      className="font-medium text-rose-800 hover:underline dark:text-rose-200"
                    >
                      Szczegóły
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
