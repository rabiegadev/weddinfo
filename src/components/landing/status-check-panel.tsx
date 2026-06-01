"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { unlockInquiryWithPassword } from "@/app/zapytanie/[unid]/actions";

type StatusCheckPanelProps = {
  /** Górna krawędź panelu styka się z sekcją nad nim (bez odstępu). */
  connectedTop?: boolean;
};

export function StatusCheckPanel({ connectedTop = false }: StatusCheckPanelProps) {
  const router = useRouter();
  const [publicId, setPublicId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const id = publicId.trim().replace(/^#/, "");
    if (!id) {
      setError("Podaj numer zgłoszenia.");
      return;
    }
    setPending(true);
    try {
      const res = await unlockInquiryWithPassword(id, password);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push(`/zapytanie/${encodeURIComponent(id)}`);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <aside
      className={`flex h-full min-h-full flex-col bg-[var(--bg-dark)] px-6 pb-8 sm:px-8 sm:pb-10 ${
        connectedTop ? "pt-8 sm:pt-10" : "p-6 shadow-[0_16px_48px_rgba(0,0,0,0.12)] sm:p-8"
      }`}
    >
      <h3 className="font-wedinfo-serif text-xl font-medium leading-snug text-white sm:text-2xl">
        Śledź status swojego zgłoszenia
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/65">
        Wpisz numer zgłoszenia i hasło z wiadomości e-mail, którą wysłaliśmy po wysłaniu formularza.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {error ? (
          <p className="rounded border border-red-400/30 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
            Numer zgłoszenia
          </span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="np. 123456"
            value={publicId}
            onChange={(e) => setPublicId(e.target.value)}
            className="w-full border border-[var(--border-dark)] bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[var(--gold)] focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
            Hasło
          </span>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Hasło z e-maila"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[var(--border-dark)] bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[var(--gold)] focus:outline-none"
          />
        </label>
        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? "Sprawdzanie…" : "Sprawdź status"}
        </button>
      </form>
      <p className="mt-6 flex items-center gap-2 text-xs text-white/55">
        <span aria-hidden>🔒</span>
        Bez logowania i rejestracji
      </p>
    </aside>
  );
}
