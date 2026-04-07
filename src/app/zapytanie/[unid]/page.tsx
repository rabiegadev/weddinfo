import Link from "next/link";
import { notFound } from "next/navigation";
import { getInquiryByPublicId } from "@/data/inquiries";
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
        <InquiryDetails inquiry={inquiry} />
      ) : (
        <InquiryPasswordForm publicId={unid} />
      )}
    </div>
  );
}
