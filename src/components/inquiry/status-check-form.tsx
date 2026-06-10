"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { inputClass, labelClass } from "@/app/kontakt/form-ui";
import { unlockInquiryWithPassword } from "@/app/zapytanie/[publicId]/actions";

export function StatusCheckForm() {
  const router = useRouter();
  const [publicId, setPublicId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="text-center">
      <p className="text-sm leading-relaxed text-[var(--text-muted)]">
        Wpisz numer i hasło z e-maila potwierdzającego po wysłaniu formularza.
      </p>
      <form
        className="mx-auto mt-8 max-w-md space-y-5 text-left"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          const id = publicId.trim().replace(/^#/, "");
          startTransition(async () => {
            const res = await unlockInquiryWithPassword(id, password);
            if (!res.ok) {
              setError(res.error);
              return;
            }
            router.push(`/zapytanie/${encodeURIComponent(id)}`);
          });
        }}
      >
        {error ? (
          <p className="rounded border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
        <div>
          <label htmlFor="status-public-id" className={labelClass}>
            Numer zgłoszenia
          </label>
          <input
            id="status-public-id"
            value={publicId}
            onChange={(e) => setPublicId(e.target.value)}
            inputMode="numeric"
            placeholder="np. 482917"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="status-password" className={labelClass}>
            Hasło
          </label>
          <input
            id="status-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Hasło z e-maila"
            className={inputClass}
          />
        </div>
        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? "Sprawdzanie…" : "Sprawdź status"}
        </button>
      </form>
      <p className="mt-8 text-sm text-[var(--text-muted)]">
        Nie masz jeszcze zgłoszenia?{" "}
        <Link href="/kontakt" className="font-semibold text-[var(--gold)] hover:opacity-80">
          Przejdź do formularza →
        </Link>
      </p>
    </div>
  );
}
