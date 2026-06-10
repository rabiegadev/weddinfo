"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { labelClass, textareaClass } from "@/app/kontakt/form-ui";
import type { InquiryStatus } from "@/db/schema";
import { inquiryStatusLabels } from "@/lib/inquiry-status";
import { adminReplyAction, adminStatusAction } from "../../actions";

const statusOptions: InquiryStatus[] = [
  "new",
  "in_progress",
  "closed",
  "cancelled_by_client",
];

type AdminInquiryControlsProps = {
  publicId: string;
  currentStatus: InquiryStatus;
};

export function AdminInquiryControls({ publicId, currentStatus }: AdminInquiryControlsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState<InquiryStatus>(currentStatus);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="space-y-8 border-t border-[var(--border-light)] pt-8">
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
          Odpowiedź do klienta
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            setSuccess(null);
            startTransition(async () => {
              const res = await adminReplyAction(publicId, reply);
              if (!res.ok) {
                setError(res.error);
                return;
              }
              setReply("");
              setSuccess("Odpowiedź wysłana. Klient otrzyma e-mail z powiadomieniem.");
              router.refresh();
            });
          }}
        >
          <label htmlFor="admin-reply" className={labelClass}>
            Treść odpowiedzi
          </label>
          <textarea
            id="admin-reply"
            rows={5}
            required
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className={textareaClass}
          />
          <button type="submit" disabled={pending} className="btn-primary mt-4">
            {pending ? "Wysyłanie…" : "Wyślij odpowiedź"}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">Status</h2>
        <form
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            setSuccess(null);
            startTransition(async () => {
              const res = await adminStatusAction(publicId, status);
              if (!res.ok) {
                setError(res.error);
                return;
              }
              setSuccess("Status zaktualizowany. Klient otrzyma e-mail.");
              router.refresh();
            });
          }}
        >
          <div className="flex-1">
            <label htmlFor="admin-status" className={labelClass}>
              Zmień status
            </label>
            <select
              id="admin-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as InquiryStatus)}
              className="w-full border border-[var(--border-light)] bg-white px-4 py-3 text-sm"
            >
              {statusOptions.map((value) => (
                <option key={value} value={value}>
                  {inquiryStatusLabels[value]}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={pending} className="btn-secondary sm:min-w-[180px]">
            Zapisz status
          </button>
        </form>
      </section>

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
    </div>
  );
}
