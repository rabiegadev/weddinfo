import Link from "next/link";
import { RESPONSE_TIME_LABEL } from "@/config/inquiry-tabs";
import type { SubmitInquiryResult } from "./actions";

type InquirySuccessProps = {
  result: Extract<SubmitInquiryResult, { ok: true }>;
  onReset: () => void;
};

export function InquirySuccess({ result, onReset }: InquirySuccessProps) {
  return (
    <div className="border border-[var(--gold-line)] bg-[var(--bg-light)] p-8 text-center sm:p-10">
      <p className="font-wedinfo-serif text-2xl text-[var(--text-dark)]">Dziękujemy!</p>
      <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
        Otrzymaliśmy formularz. Potwierdzenie wysłaliśmy na podany adres e-mail wraz z numerem zgłoszenia i hasłem
        do sprawdzania statusu.
      </p>
      <p className="mt-4 text-sm text-[var(--text-dark)]">
        Numer: <strong className="text-[var(--gold)]">#{result.publicId}</strong>
      </p>
      {result.guestPassword ? (
        <p className="mt-2 text-sm text-[var(--text-dark)]">
          Hasło (dev): <code className="rounded bg-white px-2 py-1">{result.guestPassword}</code>
        </p>
      ) : null}
      <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
        Przewidywany czas odpowiedzi: {RESPONSE_TIME_LABEL}
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href={`/zapytanie/${result.publicId}`} className="btn-primary">
          Sprawdź status
        </Link>
        <button type="button" onClick={onReset} className="btn-secondary">
          Nowy formularz
        </button>
      </div>
    </div>
  );
}
