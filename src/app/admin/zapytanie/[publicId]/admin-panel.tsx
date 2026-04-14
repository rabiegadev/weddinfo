"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { InquiryAttachmentRow } from "@/data/inquiry-attachments";
import type { InquiryMessageRow } from "@/data/inquiry-messages";
import type { RsvpResponseRow } from "@/data/rsvp-responses";
import {
  adminAddAttachment,
  adminPostMessage,
  adminUpdateStatus,
} from "./actions";

function formatWhen(d: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(d));
}

const STATUS_OPTIONS = [
  { value: "new", label: "Nowe" },
  { value: "in_progress", label: "W toku" },
  { value: "closed", label: "Zamknięte" },
] as const;

export function AdminInquiryPanel({
  publicId,
  currentStatus,
  messages,
  attachments,
  rsvps,
  guestPageUrl,
}: {
  publicId: string;
  currentStatus: string;
  messages: InquiryMessageRow[];
  attachments: InquiryAttachmentRow[];
  rsvps: RsvpResponseRow[];
  guestPageUrl: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [statusErr, setStatusErr] = useState<string | null>(null);
  const [statusPending, setStatusPending] = useState(false);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  async function saveStatus(e: React.FormEvent) {
    e.preventDefault();
    setStatusErr(null);
    setStatusPending(true);
    try {
      const res = await adminUpdateStatus(publicId, status);
      if (!res.ok) setStatusErr(res.error);
      else router.refresh();
    } finally {
      setStatusPending(false);
    }
  }

  const [msgBody, setMsgBody] = useState("");
  const [msgErr, setMsgErr] = useState<string | null>(null);
  const [msgPending, setMsgPending] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    setMsgErr(null);
    setMsgPending(true);
    try {
      const res = await adminPostMessage(publicId, msgBody);
      if (!res.ok) setMsgErr(res.error);
      else {
        setMsgBody("");
        router.refresh();
      }
    } finally {
      setMsgPending(false);
    }
  }

  const [attUrl, setAttUrl] = useState("");
  const [attRole, setAttRole] = useState("");
  const [attErr, setAttErr] = useState<string | null>(null);
  const [attPending, setAttPending] = useState(false);

  async function addAtt(e: React.FormEvent) {
    e.preventDefault();
    setAttErr(null);
    setAttPending(true);
    try {
      const res = await adminAddAttachment(publicId, { url: attUrl, role: attRole });
      if (!res.ok) setAttErr(res.error);
      else {
        setAttUrl("");
        setAttRole("");
        router.refresh();
      }
    } finally {
      setAttPending(false);
    }
  }

  const statusKnown = STATUS_OPTIONS.some((o) => o.value === currentStatus);

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-950/40">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Link dla gościa
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Strona z harmonogramem (hasło z zapisu zapytania):{" "}
          <a
            href={guestPageUrl}
            className="break-all font-mono text-rose-800 underline-offset-2 hover:underline dark:text-rose-200"
          >
            {guestPageUrl}
          </a>
        </p>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
          Status
        </h2>
        <form onSubmit={saveStatus} className="mt-2 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
            >
              {!statusKnown ? (
                <option value={currentStatus}>{currentStatus}</option>
              ) : null}
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={statusPending}
            className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-900 disabled:opacity-60 dark:bg-zinc-600"
          >
            {statusPending ? "Zapisywanie…" : "Zapisz status"}
          </button>
          {statusErr ? (
            <span className="text-sm text-red-600 dark:text-red-400">{statusErr}</span>
          ) : null}
        </form>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
          Wiadomości
        </h2>
        {messages.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Brak wiadomości.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  m.authorRole === "staff"
                    ? "border-rose-200/80 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20"
                    : "border-zinc-200 dark:border-zinc-700"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {m.authorRole === "staff" ? "Zespół" : "Para / gość"} · {formatWhen(m.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={sendMessage} className="mt-4 space-y-2">
          {msgErr ? <p className="text-sm text-red-600">{msgErr}</p> : null}
          <textarea
            value={msgBody}
            onChange={(e) => setMsgBody(e.target.value)}
            rows={4}
            placeholder="Wiadomość do pary (widoczna po zalogowaniu hasłem)…"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          />
          <button
            type="submit"
            disabled={msgPending}
            className="rounded-full bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-60"
          >
            {msgPending ? "Wysyłanie…" : "Wyślij jako zespół"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
          Załączniki (URL)
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Dodaj publiczny link (np. mapa w Google, PDF w chmurze). Etykieta jest widoczna dla gości.
        </p>
        {attachments.length > 0 ? (
          <ul className="mt-2 space-y-3 text-sm">
            {attachments.map((a) => (
              <li key={a.id}>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-800 underline-offset-2 hover:underline dark:text-rose-200"
                >
                  {a.role}
                </a>
                <span className="text-zinc-500"> · {formatWhen(a.createdAt)}</span>
                {/\.(png|jpe?g|webp|gif)$/i.test(a.url) ? (
                  <div className="mt-2">
                    <a href={a.url} target="_blank" rel="noopener noreferrer">
                      <Image
                        src={a.url}
                        alt={a.role}
                        width={704}
                        height={352}
                        unoptimized
                        className="max-h-44 w-auto rounded-lg border border-zinc-200 object-cover dark:border-zinc-700"
                      />
                    </a>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
        <form onSubmit={addAtt} className="mt-3 grid gap-2 sm:grid-cols-2">
          {attErr ? (
            <p className="sm:col-span-2 text-sm text-red-600">{attErr}</p>
          ) : null}
          <input
            value={attUrl}
            onChange={(e) => setAttUrl(e.target.value)}
            placeholder="https://…"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
          <input
            value={attRole}
            onChange={(e) => setAttRole(e.target.value)}
            placeholder="Etykieta (np. Mapa dojazdu)"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
          <button
            type="submit"
            disabled={attPending}
            className="sm:col-span-2 rounded-full bg-zinc-800 py-2 text-sm font-medium text-white hover:bg-zinc-900 disabled:opacity-60"
          >
            {attPending ? "Dodawanie…" : "Dodaj załącznik"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-900/80 dark:text-rose-200/90">
          RSVP
        </h2>
        {rsvps.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Brak odpowiedzi (lub nikt jeszcze nie wypełnił formularza).
          </p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="py-2 pr-4 font-medium">Gość</th>
                  <th className="py-2 pr-4 font-medium">E-mail</th>
                  <th className="py-2 pr-4 font-medium">Obecność</th>
                  <th className="py-2 pr-4 font-medium">Uwagi</th>
                  <th className="py-2 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((r) => (
                  <tr key={r.id} className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-2 pr-4">{r.guestName}</td>
                    <td className="py-2 pr-4">{r.guestEmail ?? "—"}</td>
                    <td className="py-2 pr-4">{r.attending ? "Tak" : "Nie"}</td>
                    <td className="max-w-[12rem] truncate py-2 pr-4" title={r.dietaryNote ?? ""}>
                      {r.dietaryNote ?? "—"}
                    </td>
                    <td className="py-2 text-zinc-500">{formatWhen(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-sm">
        <Link href="/admin" className="text-rose-800 hover:underline dark:text-rose-200">
          ← Lista zgłoszeń
        </Link>
      </p>
    </div>
  );
}
