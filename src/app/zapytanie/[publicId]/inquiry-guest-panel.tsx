"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { labelClass, textareaClass } from "@/app/kontakt/form-ui";
import type { InquiryStatus } from "@/db/schema";
import { canGuestCancel, canGuestComment } from "@/lib/inquiry-status";
import { submitGuestCancellation, submitGuestComment } from "./actions";

type InquiryGuestPanelProps = {
  publicId: string;
  status: InquiryStatus;
};

export function InquiryGuestPanel({ publicId, status }: InquiryGuestPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canComment = canGuestComment(status);
  const canCancel = canGuestCancel(status);

  if (!canComment && !canCancel) return null;

  return (
    <section className="space-y-6 border border-[var(--border-light)] bg-[var(--bg-light)]/25 p-5 sm:p-6">
      <h2 className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
        Twoje działania
      </h2>

      {canComment ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            setSuccess(null);
            startTransition(async () => {
              const res = await submitGuestComment(publicId, comment);
              if (!res.ok) {
                setError(res.error);
                return;
              }
              setComment("");
              setSuccess("Komentarz został dodany. Wysłaliśmy potwierdzenie e-mailem.");
              router.refresh();
            });
          }}
        >
          <div>
            <label htmlFor="guest-comment" className={labelClass}>
              Dodaj komentarz
            </label>
            <textarea
              id="guest-comment"
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={textareaClass}
              placeholder="Masz pytanie lub uzupełnienie do zgłoszenia?"
            />
          </div>
          <button type="submit" disabled={pending} className="btn-secondary">
            {pending ? "Wysyłanie…" : "Wyślij komentarz"}
          </button>
        </form>
      ) : null}

      {canCancel ? (
        <div className="rounded border border-red-200/80 bg-red-50/50 p-4">
          <p className="text-sm text-[var(--text-dark)]">
            Chcesz zrezygnować z zgłoszenia? Oznaczymy je jako anulowane — otrzymasz potwierdzenie e-mailem.
          </p>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!window.confirm("Na pewno anulować to zgłoszenie?")) return;
              setError(null);
              setSuccess(null);
              startTransition(async () => {
                const res = await submitGuestCancellation(publicId);
                if (!res.ok) {
                  setError(res.error);
                  return;
                }
                setSuccess("Zgłoszenie zostało anulowane. Wysłaliśmy potwierdzenie e-mailem.");
                router.refresh();
              });
            }}
            className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-red-800 underline-offset-2 hover:underline"
          >
            Anuluj zgłoszenie
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="rounded border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded border border-green-300/60 bg-green-50 px-4 py-3 text-sm text-green-900" role="status">
          {success}
        </p>
      ) : null}
    </section>
  );
}
