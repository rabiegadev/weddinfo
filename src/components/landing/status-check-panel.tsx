"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { unlockInquiryWithPassword } from "@/app/zapytanie/[publicId]/actions";

export function StatusCheckPanel({ connectedTop = false }: { connectedTop?: boolean }) {
  const router = useRouter();
  const [publicId, setPublicId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <aside
      className={`landing-dots-dark relative flex h-full min-h-full flex-col justify-center px-6 pb-8 sm:px-8 sm:pb-10 ${
        connectedTop ? "pt-8 sm:pt-10" : "p-6 shadow-[0_16px_48px_rgba(0,0,0,0.12)] sm:p-8"
      }`}
    >
      <div className="relative z-[1]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">Status</p>
        <h3 className="font-wedinfo-serif mt-3 text-xl font-medium leading-snug text-white sm:text-2xl">
          Śledź status swojego zlecenia
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-white/65">
          Wpisz numer i hasło z e-maila potwierdzającego po wysłaniu formularza.
        </p>
        <form
          className="mt-6 space-y-4"
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
            <p className="rounded border border-red-400/30 bg-red-950/40 px-3 py-2 text-sm text-red-200">{error}</p>
          ) : null}
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
              Numer zlecenia
            </span>
            <input
              value={publicId}
              onChange={(e) => setPublicId(e.target.value)}
              inputMode="numeric"
              className="w-full border border-[var(--border-dark)] bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[var(--gold)] focus:outline-none"
              placeholder="np. 482917"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/75">Hasło</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[var(--border-dark)] bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[var(--gold)] focus:outline-none"
              placeholder="Hasło z e-maila"
            />
          </label>
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Sprawdzanie…" : "Sprawdź status"}
          </button>
        </form>
      </div>
    </aside>
  );
}
