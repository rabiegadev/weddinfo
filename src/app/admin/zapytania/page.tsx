import type { Metadata } from "next";
import Link from "next/link";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";
import { getInquiryTabLabel } from "@/config/inquiry-tabs";
import { listInquiries } from "@/data/inquiries";
import { getInquiryDisplayName } from "@/lib/inquiry-display";
import { requireAdminSession } from "@/lib/admin-session";
import { inquiryStatusLabels } from "@/lib/inquiry-status";
import { adminLogoutAction } from "../actions";

export const metadata: Metadata = {
  title: "Zgłoszenia — admin",
  robots: { index: false, follow: false },
};

function formatDate(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminInquiriesPage() {
  await requireAdminSession();
  const rows = await listInquiries();

  return (
    <div className="px-4 pb-16 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6">
      <LandingSectionInner className="max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-wedinfo-serif text-2xl text-[var(--text-dark)] sm:text-3xl">Zgłoszenia</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{rows.length} rekordów w bazie</p>
          </div>
          <form action={adminLogoutAction}>
            <button type="submit" className="btn-secondary text-sm">
              Wyloguj
            </button>
          </form>
        </div>

        {rows.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">Brak zgłoszeń.</p>
        ) : (
          <div className="overflow-x-auto border border-[var(--border-light)] bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[var(--border-light)] bg-[var(--bg-light)]/50 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Numer</th>
                  <th className="px-4 py-3 font-semibold">Typ</th>
                  <th className="px-4 py-3 font-semibold">Klient</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Data</th>
                  <th className="px-4 py-3 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-[var(--border-light)] last:border-0">
                    <td className="px-4 py-3 font-medium text-[var(--text-dark)]">#{row.publicId}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">
                      {getInquiryTabLabel(row.inquiryType)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[var(--text-dark)]">{getInquiryDisplayName(row)}</div>
                      <div className="text-xs text-[var(--text-muted)]">{row.clientEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-dark)]">
                      {inquiryStatusLabels[row.status]}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/zapytania/${row.publicId}`}
                        className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--gold)] hover:opacity-80"
                      >
                        Otwórz →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </LandingSectionInner>
    </div>
  );
}
