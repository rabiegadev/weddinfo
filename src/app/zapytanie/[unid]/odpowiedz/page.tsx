import Link from "next/link";
import { notFound } from "next/navigation";
import { getInquiryByPublicId } from "@/data/inquiries";
import { TokenReplyForm } from "./token-reply-form";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ unid: string }>;
  searchParams: Promise<{ t?: string }>;
};

export default async function OdpowiedzPage({ params, searchParams }: Props) {
  const { unid } = await params;
  const { t } = await searchParams;
  const exists = await getInquiryByPublicId(unid);
  if (!exists) notFound();

  const tokenPlain = typeof t === "string" ? t : "";

  return (
    <div className="mx-auto min-h-[60vh] max-w-lg px-4 py-12 sm:px-6">
      <p className="mb-8 text-center text-sm">
        <Link
          href="/"
          className="text-rose-800 hover:underline dark:text-rose-200"
        >
          ← Strona główna
        </Link>
      </p>
      <h1 className="mb-6 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Odpowiedź na zapytanie
      </h1>
      {!tokenPlain ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
          Brak tokenu w adresie linku. Użyj pełnego linku z wiadomości e-mail.
        </p>
      ) : (
        <TokenReplyForm publicId={unid} tokenPlain={tokenPlain} />
      )}
    </div>
  );
}
