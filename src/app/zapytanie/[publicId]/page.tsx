import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";
import { getInquiryByPublicId } from "@/data/inquiries";
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
  const inquiry = await getInquiryByPublicId(publicId);
  if (!inquiry) notFound();

  const unlocked = await hasGuestViewAccess(publicId);

  return (
    <div className="page-below-header pb-16">
      <LandingSectionInner className="max-w-3xl">
        <p className="mb-8 text-sm">
          <Link href="/kontakt" className="text-[var(--gold)] hover:underline">
            ← Formularze kontaktowe
          </Link>
        </p>

        {unlocked ? (
          <InquiryDetails inquiry={inquiry} />
        ) : (
          <div className="border border-[var(--border-light)] bg-white p-6 sm:p-8">
            <h1 className="font-wedinfo-serif text-2xl text-[var(--text-dark)]">Status zgłoszenia</h1>
            <div className="mt-8">
              <InquiryPasswordForm publicId={publicId} />
            </div>
          </div>
        )}
      </LandingSectionInner>
    </div>
  );
}
