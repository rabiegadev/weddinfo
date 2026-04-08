import Link from "next/link";
import { notFound } from "next/navigation";
import { listAttachmentsByInquiryId } from "@/data/inquiry-attachments";
import { listMessagesByInquiryId } from "@/data/inquiry-messages";
import {
  getInquiryByPublicId,
  getInquiryInternalIdByPublicId,
} from "@/data/inquiries";
import { inquiryViewCookieValid } from "./actions";
import { InquiryDetails } from "./inquiry-details";
import { InquiryPasswordForm } from "./inquiry-password-form";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ unid: string }> };

export default async function InquiryPage({ params }: Props) {
  const { unid } = await params;
  const exists = await getInquiryByPublicId(unid);
  if (!exists) notFound();

  const unlocked = await inquiryViewCookieValid(unid);
  const inquiry = unlocked ? exists : null;
  const inquiryId = inquiry
    ? await getInquiryInternalIdByPublicId(unid)
    : null;
  const messages =
    inquiry && inquiryId ? await listMessagesByInquiryId(inquiryId) : [];
  const attachments =
    inquiry && inquiryId ? await listAttachmentsByInquiryId(inquiryId) : [];

  return (
    <div className="mx-auto min-h-[60vh] max-w-3xl px-4 py-12 sm:px-6">
      <p className="mb-8 text-center text-sm">
        <Link
          href="/"
          className="text-rose-800 hover:underline dark:text-rose-200"
        >
          ← Strona główna
        </Link>
      </p>
      {inquiry ? (
        <InquiryDetails
          inquiry={inquiry}
          messages={messages}
          attachments={attachments}
        />
      ) : (
        <InquiryPasswordForm publicId={unid} />
      )}
    </div>
  );
}
