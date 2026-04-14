"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { InquiryAttachmentRow } from "@/data/inquiry-attachments";
import type { InquiryMessageRow } from "@/data/inquiry-messages";
import type { RsvpResponseRow } from "@/data/rsvp-responses";
import { postGuestMessage, submitGuestRsvp } from "./actions";

function formatWhen(d: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(d));
}

export function GuestCorrespondenceSection({
  publicId,
  messages,
  attachments,
  rsvpEnabled,
  inquiryStatus,
  rsvps,
}: {
  publicId: string;
  messages: InquiryMessageRow[];
  attachments: InquiryAttachmentRow[];
  rsvpEnabled: boolean;
  inquiryStatus: string;
  rsvps: RsvpResponseRow[];
}) {
  const showRsvpManagement =
    rsvpEnabled && (inquiryStatus === "in_progress" || inquiryStatus === "closed");
  const attendingCount = rsvps.filter((r) => r.attending).length;
  const notAttendingCount = rsvps.length - attendingCount;

  return (
    <div className="space-y-8">
      {attachments.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
            Materiały
          </h2>
          <ul className="space-y-2 text-sm">
            {attachments.map((a) => (
              <li key={a.id}>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-rose-800 underline-offset-2 hover:underline dark:text-rose-200"
                >
                  {a.role}
                </a>
                <span className="ml-2 text-zinc-500">
                  · {formatWhen(a.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
          Wiadomości z zespołem
        </h2>
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Brak wiadomości — napisz pierwszą poniżej.
          </p>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  m.authorRole === "staff"
                    ? "border-rose-200/80 bg-rose-50/80 dark:border-rose-900/40 dark:bg-rose-950/30"
                    : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
                }`}
              >
                <p className="whitespace-pre-wrap text-zinc-900 dark:text-zinc-100">
                  {m.body}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {m.authorRole === "staff" ? "Zespół" : "Ty"} ·{" "}
                  {formatWhen(m.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
        <GuestMessageForm publicId={publicId} />
      </section>

      {showRsvpManagement ? (
        <section className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-950/40">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
            RSVP (ręczne notowanie)
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Uzupełnij odpowiedź ręcznie, np. gdy gość potwierdzi obecność telefonicznie lub osobiście.
          </p>
          <GuestRsvpForm publicId={publicId} />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              Odpowiedzi RSVP
            </h3>
            {rsvps.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Brak zapisanych odpowiedzi RSVP.
              </p>
            ) : (
              <ul className="space-y-2">
                {rsvps.map((rsvp) => (
                  <li
                    key={rsvp.id}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {rsvp.guestName}
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Obecność: {rsvp.attending ? "Tak" : "Nie"}
                      {rsvp.guestEmail ? ` · ${rsvp.guestEmail}` : ""}
                    </p>
                    {rsvp.dietaryNote ? (
                      <p className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                        Uwagi: {rsvp.dietaryNote}
                      </p>
                    ) : null}
                    <p className="text-xs text-zinc-500">{formatWhen(rsvp.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white px-3 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              Podsumowanie RSVP
            </p>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              Łącznie odpowiedzi: {rsvps.length}
              {" · "}
              Będzie: {attendingCount}
              {" · "}
              Nie będzie: {notAttendingCount}
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function GuestMessageForm({ publicId }: { publicId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await postGuestMessage(publicId, body);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setBody("");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      {error ? (
        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
      ) : null}
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">Nowa wiadomość</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          placeholder="Napisz wiadomość do zespołu…"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-60 dark:bg-rose-700"
      >
        {pending ? "Wysyłanie…" : "Wyślij"}
      </button>
    </form>
  );
}

function GuestRsvpForm({ publicId }: { publicId: string }) {
  const router = useRouter();
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [attending, setAttending] = useState(true);
  const [dietaryNote, setDietaryNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await submitGuestRsvp(publicId, {
        guestName,
        guestEmail: guestEmail || undefined,
        attending,
        dietaryNote: dietaryNote || undefined,
      });
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
      <section className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100">
        Dziękujemy — zapisaliśmy Twoją odpowiedź RSVP.
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        {error ? (
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        ) : null}
        <label className="flex flex-col gap-1">
          <span className="text-zinc-600 dark:text-zinc-400">Imię i nazwisko</span>
          <input
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-zinc-600 dark:text-zinc-400">E-mail (opcjonalnie)</span>
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <fieldset className="flex flex-wrap gap-4">
          <legend className="mb-1 text-zinc-600 dark:text-zinc-400">Obecność</legend>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="attending"
              checked={attending}
              onChange={() => setAttending(true)}
            />
            Będę
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="attending"
              checked={!attending}
              onChange={() => setAttending(false)}
            />
            Nie mogę
          </label>
        </fieldset>
        <label className="flex flex-col gap-1">
          <span className="text-zinc-600 dark:text-zinc-400">
            Dieta / uwagi (opcjonalnie)
          </span>
          <textarea
            value={dietaryNote}
            onChange={(e) => setDietaryNote(e.target.value)}
            rows={2}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-60 dark:bg-rose-700"
        >
          {pending ? "Zapisywanie…" : "Dodaj odpowiedź RSVP"}
        </button>
      </form>
  );
}
