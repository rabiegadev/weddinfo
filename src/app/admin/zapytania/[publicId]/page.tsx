import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";
import { InquiryAttachmentsList } from "@/components/inquiry/inquiry-attachments-list";
import { InquiryBriefSection } from "@/components/inquiry/inquiry-brief-section";
import { InquiryMessagesList } from "@/components/inquiry/inquiry-messages-list";
import { getInquiryTabLabel } from "@/config/inquiry-tabs";
import { getInquiryWithRelations } from "@/data/inquiries";
import { requireAdminSession } from "@/lib/admin-session";
import { getInquiryDisplayName } from "@/lib/inquiry-display";
import { inquiryStatusLabels } from "@/lib/inquiry-status";
import { AdminInquiryControls } from "./admin-inquiry-controls";

type PageProps = {
  params: Promise<{ publicId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { publicId } = await params;
  return { title: `Admin — #${publicId}`, robots: { index: false, follow: false } };
}

export default async function AdminInquiryDetailPage({ params }: PageProps) {
  await requireAdminSession();
  const { publicId } = await params;
  const data = await getInquiryWithRelations(publicId);
  if (!data) notFound();

  const { inquiry, attachments, messages } = data;

  return (
    <div className="px-4 pb-16 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6">
      <LandingSectionInner className="max-w-4xl">
        <p className="mb-6 text-sm">
          <Link href="/admin/zapytania" className="text-[var(--gold)] hover:underline">
            ← Lista zgłoszeń
          </Link>
        </p>

        <header className="border-b border-[var(--border-light)] pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
            {getInquiryTabLabel(inquiry.inquiryType)}
          </p>
          <h1 className="font-wedinfo-serif mt-2 text-2xl text-[var(--text-dark)] sm:text-3xl">
            {getInquiryDisplayName(inquiry)}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            #{inquiry.publicId} · {inquiry.clientEmail} · {inquiryStatusLabels[inquiry.status]}
          </p>
          <Link
            href={`/zapytanie/${inquiry.publicId}`}
            className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-dark)] hover:text-[var(--gold)]"
          >
            Widok klienta →
          </Link>
        </header>

        <div className="mt-8 space-y-10">
          {inquiry.inquiryType === "contact" && inquiry.contactMessage ? (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
                Wiadomość początkowa
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-dark)]">
                {inquiry.contactMessage}
              </p>
            </section>
          ) : null}

          <InquiryBriefSection inquiry={inquiry} />

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">Załączniki</h2>
            <div className="mt-4">
              <InquiryAttachmentsList publicId={inquiry.publicId} attachments={attachments} />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">Korespondencja</h2>
            <div className="mt-4">
              <InquiryMessagesList messages={messages} viewer="admin" />
            </div>
          </section>

          <AdminInquiryControls publicId={inquiry.publicId} currentStatus={inquiry.status} />
        </div>
      </LandingSectionInner>
    </div>
  );
}
