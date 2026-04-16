import type { Metadata } from "next";
import { InquiryForm } from "./inquiry-form";

export const metadata: Metadata = {
  title: "Złóż zapytanie — Weddinfo",
  description:
    "Formularz wizytówki weselnej i formularz kontaktowy.",
};

export default function ZlozZapytaniePage() {
  return (
    <div className="page-below-header mx-auto max-w-3xl px-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:pb-14">
      <header className="mb-10 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          Formularze
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Wybierz typ formularza i prześlij szczegóły. Dane zapisujemy oddzielnie dla formularza
          wizytówki weselnej i formularza kontaktowego.
        </p>
      </header>
      <InquiryForm />
    </div>
  );
}
