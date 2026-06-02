"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { unlockInquiryWithPassword } from "./actions";

export function InquiryPasswordForm({ publicId }: { publicId: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="mx-auto max-w-md space-y-5"
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
      <p className="text-sm text-[var(--text-muted)]">
        Wpisz hasło z e-maila potwierdzającego, aby zobaczyć status zgłoszenia <strong>#{publicId}</strong>.
      </p>
      {error ? (
        <p className="rounded border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      ) : null}
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-dark)]">
          Hasło
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full border border-[var(--border-light)] px-4 py-3 text-sm focus:border-[var(--gold)] focus:outline-none"
        />
      </label>
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Sprawdzanie…" : "Otwórz podgląd"}
      </button>
    </form>
  );
}
