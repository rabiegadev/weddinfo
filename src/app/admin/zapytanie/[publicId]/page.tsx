import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listAttachmentsByInquiryId } from "@/data/inquiry-attachments";
import { listMessagesByInquiryId } from "@/data/inquiry-messages";
import { getInquiryAdminByPublicId } from "@/data/inquiries";
import { listRsvpByInquiryId } from "@/data/rsvp-responses";
import { requireAdminSession } from "@/lib/admin-auth";
import { getSiteBaseUrl } from "@/lib/site-url";
import { AdminInquiryPanel } from "./admin-panel";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ publicId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publicId } = await params;
  return { title: `Zapytanie ${publicId} — Weddinfo` };
}

export default async function AdminInquiryPage({ params }: Props) {
  await requireAdminSession();
  const { publicId } = await params;
  const inquiry = await getInquiryAdminByPublicId(publicId);
  if (!inquiry) notFound();

  const [messages, attachments, rsvps, base] = await Promise.all([
    listMessagesByInquiryId(inquiry.id),
    listAttachmentsByInquiryId(inquiry.id),
    listRsvpByInquiryId(inquiry.id),
    getSiteBaseUrl(),
  ]);

  const guestPageUrl = `${base}/zapytanie/${encodeURIComponent(publicId)}`;
  const names = `${inquiry.partner1FirstName} ${inquiry.partner1LastName} & ${inquiry.partner2FirstName} ${inquiry.partner2LastName}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-col gap-2 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <p className="font-mono text-sm text-rose-800 dark:text-rose-200">
          #{inquiry.publicId}
        </p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {names}
        </h1>
        <dl className="mt-2 grid gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            <span className="text-zinc-500">E-mail pary: </span>
            <a
              href={`mailto:${inquiry.clientEmail}`}
              className="text-rose-800 hover:underline dark:text-rose-200"
            >
              {inquiry.clientEmail}
            </a>
          </div>
          {inquiry.clientPhone ? (
            <div>
              <span className="text-zinc-500">Telefon: </span>
              {inquiry.clientPhone}
            </div>
          ) : null}
        </dl>
        <p className="mt-2 text-sm">
          <Link
            href="/admin/logout"
            className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Wyloguj
          </Link>
        </p>
      </header>

      <AdminInquiryPanel
        publicId={publicId}
        currentStatus={inquiry.status}
        messages={messages}
        attachments={attachments}
        rsvps={rsvps}
        guestPageUrl={guestPageUrl}
      />
    </div>
  );
}
