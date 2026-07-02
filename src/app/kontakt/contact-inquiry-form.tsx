"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { submitInquiryForm, type SubmitInquiryResult } from "./actions";
import { CaptchaField } from "./captcha-field";
import {
  buildFormDataFromDraft,
  clearDraftFromSession,
  createEmptyDraft,
  createEmptyFileDraft,
  loadDraftFromSession,
  saveDraftToSession,
  type InquiryFileDraft,
  type InquiryFormDraft,
} from "./inquiry-form-draft";
import {
  ControlledFileUploadField,
  HoneypotField,
  inputClass,
  labelClass,
  textareaClass,
} from "./form-ui";
import { InquirySuccess } from "./inquiry-success";
import { TurnstileField } from "./turnstile-field";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
const CONTACT_STORAGE_KEY = "weddinfo-contact-draft-v1";

function loadContactDraft(): InquiryFormDraft {
  const saved = loadDraftFromSession();
  if (saved?.mode === "contact") return saved;
  return createEmptyDraft("contact");
}

function saveContactDraft(draft: InquiryFormDraft): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // sessionStorage pełne lub niedostępne — ignorujemy
  }
}

function clearContactDraft(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CONTACT_STORAGE_KEY);
  clearDraftFromSession();
}

export function ContactInquiryForm() {
  const [draft, setDraft] = useState<InquiryFormDraft>(() => loadContactDraft());
  const [files, setFiles] = useState<InquiryFileDraft>(createEmptyFileDraft);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<SubmitInquiryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState("");
  const useTurnstile = TURNSTILE_SITE_KEY.length > 0;

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  useEffect(() => {
    saveContactDraft(draft);
  }, [draft]);

  const resetAll = useCallback(() => {
    clearContactDraft();
    setDraft(createEmptyDraft("contact"));
    setFiles(createEmptyFileDraft());
    setError(null);
    setResult(null);
    setTurnstileToken("");
    setCaptchaKey((k) => k + 1);
  }, []);

  if (result?.ok) {
    return (
      <InquirySuccess
        result={result}
        onReset={() => {
          clearContactDraft();
          setDraft(createEmptyDraft("contact"));
          setFiles(createEmptyFileDraft());
          setResult(null);
          setCaptchaKey((k) => k + 1);
        }}
      />
    );
  }

  const s = draft.shared;

  return (
    <form
      encType="multipart/form-data"
      className="space-y-10"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        if (files.contactFiles.length > 2) {
          setError("Można przesłać maksymalnie 2 pliki graficzne.");
          return;
        }

        if (useTurnstile && !turnstileToken) {
          setError("Poczekaj na zakończenie weryfikacji antyspamowej.");
          return;
        }

        const formEl = e.currentTarget;
        const captchaToken = String(new FormData(formEl).get("captchaToken") ?? "");
        const captchaAnswer = String(new FormData(formEl).get("captchaAnswer") ?? "");
        const fd = buildFormDataFromDraft(draft, files, captchaToken, captchaAnswer);
        if (useTurnstile) {
          fd.set("turnstileToken", turnstileToken);
        }

        startTransition(async () => {
          const res = await submitInquiryForm(fd);
          if (!res.ok) {
            setError(res.error);
            setTurnstileToken("");
            setCaptchaKey((k) => k + 1);
            return;
          }
          clearContactDraft();
          setResult(res);
        });
      }}
    >
      <HoneypotField />

      <div className="space-y-6">
        <div>
          <h3 className="font-wedinfo-serif text-xl font-medium text-[var(--text-dark)]">Wiadomość</h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Krótkie pytanie lub wiadomość — odpowiemy w ciągu 1–2 dni roboczych.
          </p>
        </div>
        <div>
          <label htmlFor="contactFullName" className={labelClass}>
            Imię i nazwisko
          </label>
          <input
            id="contactFullName"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
            value={draft.contact.contactFullName}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                contact: { ...prev.contact, contactFullName: e.target.value },
              }))
            }
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="contactEmail" className={labelClass}>
              E-mail
            </label>
            <input
              id="contactEmail"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
              value={s.clientEmail}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  shared: { ...prev.shared, clientEmail: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <label htmlFor="contactPhone" className={labelClass}>
              Telefon{" "}
              <span className="font-normal normal-case tracking-normal text-[var(--text-muted)]">
                (opcjonalnie)
              </span>
            </label>
            <input
              id="contactPhone"
              type="tel"
              autoComplete="tel"
              className={inputClass}
              value={s.clientPhone}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  shared: { ...prev.shared, clientPhone: e.target.value },
                }))
              }
            />
          </div>
        </div>
        <div>
          <label htmlFor="contactMessage" className={labelClass}>
            Zapytanie
          </label>
          <textarea
            id="contactMessage"
            rows={6}
            required
            className={textareaClass}
            value={draft.contact.contactMessage}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                contact: { ...prev.contact, contactMessage: e.target.value },
              }))
            }
          />
        </div>
        <ControlledFileUploadField
          id="contactFiles"
          label="Załącznik graficzny"
          hint="Opcjonalnie — maks. 2 pliki (JPG, PNG, WebP, do 5 MB łącznie)."
          multiple
          files={files.contactFiles}
          onChange={(next) => setFiles((prev) => ({ ...prev, contactFiles: next }))}
        />
      </div>

      <div key={captchaKey}>
        {useTurnstile ? (
          <TurnstileField siteKey={TURNSTILE_SITE_KEY} onToken={handleTurnstileToken} />
        ) : (
          <CaptchaField />
        )}
      </div>

      {error ? (
        <p className="rounded border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-[var(--border-light)] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={resetAll} className="btn-secondary order-2 sm:order-1">
          Wyczyść formularz
        </button>
        <button type="submit" disabled={pending} className="btn-primary order-1 sm:order-2 sm:min-w-[260px]">
          {pending ? "Wysyłanie…" : "Wyślij wiadomość"}
        </button>
      </div>
    </form>
  );
}
