"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { unlockInquiryWithPassword } from "./actions";

export function InquiryPasswordForm({ publicId }: { publicId: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await unlockInquiryWithPassword(publicId, password);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Dostęp do zapytania
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Wpisz hasło z wiadomości e-mail, którą wysłaliśmy po złożeniu formularza.
      </p>
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      ) : null}
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">Hasło</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-rose-800 py-2.5 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-60 dark:bg-rose-700"
      >
        {pending ? "Sprawdzanie…" : "Pokaż szczegóły"}
      </button>
    </form>
  );
}
