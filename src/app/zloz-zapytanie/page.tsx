import type { Metadata } from "next";
import Link from "next/link";
import { InquiryForm } from "./inquiry-form";

export const metadata: Metadata = {
  title: "Złóż zapytanie — Weddinfo",
  description:
    "Formularz zapytania o wizytówkę weselną: para młoda, miejsce, harmonogram, RSVP.",
};

export default function ZlozZapytaniePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] pt-8 sm:px-6 sm:py-14 sm:pb-14 sm:pt-14">
      <p className="mb-6 text-sm">
        <Link href="/" className="text-rose-800 hover:underline dark:text-rose-200">
          ← Strona główna
        </Link>
      </p>
      <header className="mb-10 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          Zapytanie o wizytówkę weselną
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Uzupełnij dane — przygotujemy prostą stronę informacyjną pod Twoją domenę
          (np. imiona.weddinfo.pl). Upload zdjęć dodamy w kolejnym kroku.
        </p>
      </header>
      <InquiryForm />
    </div>
  );
}
