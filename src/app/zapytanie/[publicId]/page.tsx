import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InquiryStatusShell } from "@/components/inquiry/inquiry-status-shell";
import { getInquiryWithRelations } from "@/data/inquiries";
import { hasGuestViewAccess } from "@/lib/inquiry-session";
import { InquiryDetails } from "./inquiry-details";
import { InquiryPasswordForm } from "./inquiry-password-form";

type PageProps = {
  params: Promise<{ publicId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { publicId } = await params;
  return { title: `Zgłoszenie #${publicId}` };
}

export default async function InquiryStatusPage({ params }: PageProps) {
  const { publicId } = await params;
  const data = await getInquiryWithRelations(publicId);
  if (!data) notFound();

  const unlocked = await hasGuestViewAccess(publicId);

  return (
    <InquiryStatusShell
      title={unlocked ? `Zgłoszenie #${publicId}` : "Podgląd zgłoszenia"}
      subtitle={
        unlocked
          ? "Poniżej znajdziesz status, załączniki i korespondencję. Możesz też dodać komentarz lub anulować zgłoszenie."
          : `Zgłoszenie #${publicId} — wpisz hasło z e-maila potwierdzającego.`
      }
    >
      {unlocked ? (
        <InquiryDetails
          inquiry={data.inquiry}
          attachments={data.attachments}
          messages={data.messages}
        />
      ) : (
        <InquiryPasswordForm publicId={publicId} />
      )}
    </InquiryStatusShell>
  );
}
