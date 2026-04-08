"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { postGuestMessageWithReplyToken } from "./actions";

export function TokenReplyForm({
  publicId,
  tokenPlain,
}: {
  publicId: string;
  tokenPlain: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await postGuestMessageWithReplyToken(publicId, tokenPlain, body);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDone(true);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/40">
        <p className="text-emerald-900 dark:text-emerald-100">
          Wiadomość została wysłana. Dziękujemy.
        </p>
        <p>
          <Link
            href="/"
            className="font-medium text-rose-800 hover:underline dark:text-rose-200"
          >
            Strona główna
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Ten link pozwala wysłać jedną wiadomość do zespołu bez logowania hasłem.
      </p>
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      ) : null}
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">Wiadomość</span>
        <textarea
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-rose-800 py-2.5 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-60 dark:bg-rose-700"
      >
        {pending ? "Wysyłanie…" : "Wyślij wiadomość"}
      </button>
    </form>
  );
}
