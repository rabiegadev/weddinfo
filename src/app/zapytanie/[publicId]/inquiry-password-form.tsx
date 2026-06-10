"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { inputClass, labelClass } from "@/app/kontakt/form-ui";
import { unlockInquiryWithPassword } from "./actions";

export function InquiryPasswordForm({ publicId }: { publicId: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="mx-auto max-w-md space-y-6 text-center"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const res = await unlockInquiryWithPassword(publicId, password);
          if (!res.ok) {
            setError(res.error);
            return;
          }
          router.refresh();
        });
      }}
    >
      <p className="text-sm leading-relaxed text-[var(--text-muted)]">
        Hasło wysłaliśmy w e-mailu po złożeniu formularza. Po zalogowaniu zobaczysz pełny status i korespondencję.
      </p>
      {error ? (
        <p className="rounded border border-red-300/60 bg-red-50 px-4 py-3 text-left text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      <div className="text-left">
        <label htmlFor="inquiry-password" className={labelClass}>
          Hasło do zgłoszenia
        </label>
        <input
          id="inquiry-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Sprawdzanie…" : "Otwórz podgląd"}
      </button>
    </form>
  );
}
