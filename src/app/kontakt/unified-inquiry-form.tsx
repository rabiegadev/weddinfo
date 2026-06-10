"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { weddingTemplateOptions } from "@/data/wedding-templates";
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
  type InquiryFormMode,
} from "./inquiry-form-draft";
import {
  ControlledFileUploadField,
  ControlledYesNoField,
  FormSectionDivider,
  HoneypotField,
  hintClass,
  inputClass,
  labelClass,
  textareaClass,
} from "./form-ui";
import { getInquiryModeLabel, InquiryTypeSelector } from "./inquiry-type-selector";
import { InquirySuccess } from "./inquiry-success";
import { TurnstileField } from "./turnstile-field";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";

type UnifiedInquiryFormProps = {
  initialMode: InquiryFormMode;
  onModeChange: (mode: InquiryFormMode) => void;
};

function setSharedField(
  draft: InquiryFormDraft,
  key: keyof InquiryFormDraft["shared"],
  value: string,
): InquiryFormDraft {
  return { ...draft, shared: { ...draft.shared, [key]: value } };
}

export function UnifiedInquiryForm({ initialMode, onModeChange }: UnifiedInquiryFormProps) {
  const [draft, setDraft] = useState<InquiryFormDraft>(() => {
    const saved = loadDraftFromSession();
    if (saved) return { ...saved, mode: initialMode };
    return createEmptyDraft(initialMode);
  });
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
    setDraft((prev) => (prev.mode === initialMode ? prev : { ...prev, mode: initialMode }));
  }, [initialMode]);

  useEffect(() => {
    saveDraftToSession(draft);
  }, [draft]);

  const updateDraft = useCallback((updater: (prev: InquiryFormDraft) => InquiryFormDraft) => {
    setDraft((prev) => updater(prev));
  }, []);

  const selectMode = useCallback(
    (mode: InquiryFormMode) => {
      updateDraft((prev) => ({ ...prev, mode }));
      onModeChange(mode);
    },
    [onModeChange, updateDraft],
  );

  const resetAll = useCallback(() => {
    clearDraftFromSession();
    setDraft(createEmptyDraft(initialMode));
    setFiles(createEmptyFileDraft());
    setError(null);
    setResult(null);
    setTurnstileToken("");
    setCaptchaKey((k) => k + 1);
  }, [initialMode]);

  if (result?.ok) {
    return (
      <InquirySuccess
        result={result}
        onReset={() => {
          clearDraftFromSession();
          setDraft(createEmptyDraft(draft.mode));
          setFiles(createEmptyFileDraft());
          setResult(null);
          setCaptchaKey((k) => k + 1);
        }}
      />
    );
  }

  const isContact = draft.mode === "contact";
  const isIndividual = draft.mode === "individual";
  const isPremium = draft.mode === "premium";
  const s = draft.shared;

  return (
    <form
      encType="multipart/form-data"
      className="space-y-10"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const totalFiles =
          files.inspirationFiles.length + files.couplePhotoFiles.length + files.contactFiles.length;
        if (totalFiles > 2) {
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
          clearDraftFromSession();
          setResult(res);
        });
      }}
    >
      <HoneypotField />

      <InquiryTypeSelector value={draft.mode} onChange={selectMode} />

      {isContact ? (
        <div className="space-y-6">
          <div>
            <h3 className="font-wedinfo-serif text-xl font-medium text-[var(--text-dark)]">Wiadomość</h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Krótkie pytanie lub wiadomość — bez pełnego briefu weselnego.
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
                updateDraft((prev) => ({
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
                onChange={(e) => updateDraft((prev) => setSharedField(prev, "clientEmail", e.target.value))}
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
                onChange={(e) => updateDraft((prev) => setSharedField(prev, "clientPhone", e.target.value))}
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
                updateDraft((prev) => ({
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
      ) : (
        <>
          <div>
            <h3 className="font-wedinfo-serif text-xl font-medium text-[var(--text-dark)]">Dane podstawowe</h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Informacje o wydarzeniu — zachowamy je, gdy przełączysz pakiet.
            </p>
            <div className="mt-6 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="brideName" className={labelClass}>
                    Imię i nazwisko panny młodej
                  </label>
                  <input
                    id="brideName"
                    type="text"
                    required
                    className={inputClass}
                    value={s.brideName}
                    onChange={(e) => updateDraft((prev) => setSharedField(prev, "brideName", e.target.value))}
                  />
                </div>
                <div>
                  <label htmlFor="groomName" className={labelClass}>
                    Imię i nazwisko pana młodego
                  </label>
                  <input
                    id="groomName"
                    type="text"
                    required
                    className={inputClass}
                    value={s.groomName}
                    onChange={(e) => updateDraft((prev) => setSharedField(prev, "groomName", e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="weddingDate" className={labelClass}>
                  Data ślubu
                </label>
                <input
                  id="weddingDate"
                  type="date"
                  required
                  className={inputClass}
                  value={s.weddingDate}
                  onChange={(e) => updateDraft((prev) => setSharedField(prev, "weddingDate", e.target.value))}
                />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="ceremonyLocation" className={labelClass}>
                    Miejsce ślubu
                  </label>
                  <input
                    id="ceremonyLocation"
                    type="text"
                    required
                    className={inputClass}
                    value={s.ceremonyLocation}
                    onChange={(e) =>
                      updateDraft((prev) => setSharedField(prev, "ceremonyLocation", e.target.value))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="receptionLocation" className={labelClass}>
                    Miejsce wesela
                  </label>
                  <input
                    id="receptionLocation"
                    type="text"
                    required
                    className={inputClass}
                    value={s.receptionLocation}
                    onChange={(e) =>
                      updateDraft((prev) => setSharedField(prev, "receptionLocation", e.target.value))
                    }
                  />
                </div>
              </div>
              <div>
                <label htmlFor="scheduleNotes" className={labelClass}>
                  Harmonogram godzinowy
                </label>
                <textarea
                  id="scheduleNotes"
                  rows={5}
                  className={textareaClass}
                  placeholder="Np. 14:00 ceremonia, 15:30 gratulacje, 16:00 transport do sali…"
                  value={s.scheduleNotes}
                  onChange={(e) => updateDraft((prev) => setSharedField(prev, "scheduleNotes", e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="lodgingInfo" className={labelClass}>
                  Informacje o noclegach
                </label>
                <textarea
                  id="lodgingInfo"
                  rows={3}
                  className={textareaClass}
                  value={s.lodgingInfo}
                  onChange={(e) => updateDraft((prev) => setSharedField(prev, "lodgingInfo", e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="afterpartyInfo" className={labelClass}>
                  Poprawiny
                </label>
                <textarea
                  id="afterpartyInfo"
                  rows={3}
                  className={textareaClass}
                  value={s.afterpartyInfo}
                  onChange={(e) => updateDraft((prev) => setSharedField(prev, "afterpartyInfo", e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="guestInfo" className={labelClass}>
                  Informacje dla gości
                </label>
                <textarea
                  id="guestInfo"
                  rows={4}
                  className={textareaClass}
                  placeholder="Dress code, parking, prezenty, kontakt do świadków…"
                  value={s.guestInfo}
                  onChange={(e) => updateDraft((prev) => setSharedField(prev, "guestInfo", e.target.value))}
                />
              </div>
            </div>
          </div>

          <FormSectionDivider
            title={isIndividual ? "Wizualia i funkcje" : "Szablon i dopasowanie"}
            subtitle={
              isIndividual
                ? "Kolory, klimat strony, inspiracje oraz opcje dodatkowe."
                : "Wybór szablonu, kontakt i dodatkowe uwagi."
            }
          />

          <div className="space-y-6">
            <div>
              <label htmlFor="clientEmail" className={labelClass}>
                E-mail kontaktowy
              </label>
              <input
                id="clientEmail"
                type="email"
                required
                autoComplete="email"
                className={inputClass}
                value={s.clientEmail}
                onChange={(e) => updateDraft((prev) => setSharedField(prev, "clientEmail", e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="clientPhone" className={labelClass}>
                Telefon{" "}
                <span className="font-normal normal-case tracking-normal text-[var(--text-muted)]">
                  (opcjonalnie)
                </span>
              </label>
              <input
                id="clientPhone"
                type="tel"
                autoComplete="tel"
                className={inputClass}
                value={s.clientPhone}
                onChange={(e) => updateDraft((prev) => setSharedField(prev, "clientPhone", e.target.value))}
              />
            </div>

            {isPremium ? (
              <>
                <div>
                  <label htmlFor="templateName" className={labelClass}>
                    Wybór szablonu
                  </label>
                  <select
                    id="templateName"
                    required
                    className={inputClass}
                    value={draft.premium.templateName}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        premium: { ...prev.premium, templateName: e.target.value },
                      }))
                    }
                  >
                    <option value="" disabled>
                      Wybierz szablon…
                    </option>
                    {weddingTemplateOptions.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="additionalInfo" className={labelClass}>
                    Dodatkowe informacje
                  </label>
                  <textarea
                    id="additionalInfo"
                    rows={4}
                    className={textareaClass}
                    value={draft.premium.additionalInfo}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        premium: { ...prev.premium, additionalInfo: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="correctionRequests" className={labelClass}>
                    Prośby o drobne korekty
                  </label>
                  <textarea
                    id="correctionRequests"
                    rows={3}
                    className={textareaClass}
                    value={draft.premium.correctionRequests}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        premium: { ...prev.premium, correctionRequests: e.target.value },
                      }))
                    }
                  />
                </div>
                <ControlledYesNoField
                  id="premium-rsvp"
                  label="Czy ma być RSVP?"
                  checked={draft.premium.wantsRsvp}
                  notesLabel="Informacje do RSVP"
                  notesValue={draft.premium.rsvpNotes}
                  onCheckedChange={(checked) =>
                    updateDraft((prev) => ({
                      ...prev,
                      premium: { ...prev.premium, wantsRsvp: checked },
                    }))
                  }
                  onNotesChange={(value) =>
                    updateDraft((prev) => ({
                      ...prev,
                      premium: { ...prev.premium, rsvpNotes: value },
                    }))
                  }
                />
                <ControlledYesNoField
                  id="premium-qr"
                  label="Czy ma być kod QR?"
                  checked={draft.premium.wantsQrCode}
                  notesLabel="Informacje do kodu QR"
                  notesValue={draft.premium.qrCodeNotes}
                  onCheckedChange={(checked) =>
                    updateDraft((prev) => ({
                      ...prev,
                      premium: { ...prev.premium, wantsQrCode: checked },
                    }))
                  }
                  onNotesChange={(value) =>
                    updateDraft((prev) => ({
                      ...prev,
                      premium: { ...prev.premium, qrCodeNotes: value },
                    }))
                  }
                />
                <ControlledFileUploadField
                  id="premium-couplePhotos"
                  label="Zdjęcia pary"
                  hint="Maks. 2 pliki (JPG, PNG, WebP, do 5 MB łącznie)."
                  multiple
                  files={files.couplePhotoFiles}
                  onChange={(next) => setFiles((prev) => ({ ...prev, couplePhotoFiles: next }))}
                />
              </>
            ) : null}

            {isIndividual ? (
              <>
                <div>
                  <label htmlFor="colorPreferences" className={labelClass}>
                    Kolorystyka
                  </label>
                  <textarea
                    id="colorPreferences"
                    rows={2}
                    className={textareaClass}
                    value={draft.individual.colorPreferences}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        individual: { ...prev.individual, colorPreferences: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="moodClimate" className={labelClass}>
                    Klimat strony
                  </label>
                  <textarea
                    id="moodClimate"
                    rows={2}
                    className={textareaClass}
                    placeholder="Elegancko, boho, nowocześnie…"
                    value={draft.individual.moodClimate}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        individual: { ...prev.individual, moodClimate: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="themesMotifs" className={labelClass}>
                    Motywy
                  </label>
                  <textarea
                    id="themesMotifs"
                    rows={2}
                    className={textareaClass}
                    value={draft.individual.themesMotifs}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        individual: { ...prev.individual, themesMotifs: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="suggestions" className={labelClass}>
                    Sugestie i inspiracje opisem
                  </label>
                  <textarea
                    id="suggestions"
                    rows={3}
                    className={textareaClass}
                    value={draft.individual.suggestions}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        individual: { ...prev.individual, suggestions: e.target.value },
                      }))
                    }
                  />
                </div>
                <ControlledYesNoField
                  id="individual-qr"
                  label="Czy ma być kod QR?"
                  checked={draft.individual.wantsQrCode}
                  notesLabel="Uwagi do kodu QR"
                  notesValue={draft.individual.qrCodeNotes}
                  onCheckedChange={(checked) =>
                    updateDraft((prev) => ({
                      ...prev,
                      individual: { ...prev.individual, wantsQrCode: checked },
                    }))
                  }
                  onNotesChange={(value) =>
                    updateDraft((prev) => ({
                      ...prev,
                      individual: { ...prev.individual, qrCodeNotes: value },
                    }))
                  }
                />
                <ControlledYesNoField
                  id="individual-rsvp"
                  label="Czy ma być potwierdzenie obecności (RSVP)?"
                  checked={draft.individual.wantsRsvp}
                  notesLabel="Uwagi do RSVP"
                  notesValue={draft.individual.rsvpNotes}
                  onCheckedChange={(checked) =>
                    updateDraft((prev) => ({
                      ...prev,
                      individual: { ...prev.individual, wantsRsvp: checked },
                    }))
                  }
                  onNotesChange={(value) =>
                    updateDraft((prev) => ({
                      ...prev,
                      individual: { ...prev.individual, rsvpNotes: value },
                    }))
                  }
                />
                <label className="flex cursor-pointer items-start gap-3 rounded border border-[var(--border-light)] bg-[var(--bg-light)]/40 p-4">
                  <input
                    type="checkbox"
                    checked={draft.individual.wantsPasswordProtection}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        individual: { ...prev.individual, wantsPasswordProtection: e.target.checked },
                      }))
                    }
                    className="mt-1 size-4 accent-[var(--gold)]"
                  />
                  <span className="text-sm text-[var(--text-dark)]">Czy strona ma być chroniona hasłem?</span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded border border-[var(--border-light)] bg-[var(--bg-light)]/40 p-4">
                  <input
                    type="checkbox"
                    checked={draft.individual.wantsGallery}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        individual: { ...prev.individual, wantsGallery: e.target.checked },
                      }))
                    }
                    className="mt-1 size-4 accent-[var(--gold)]"
                  />
                  <span className="text-sm text-[var(--text-dark)]">Czy ma być galeria zdjęć?</span>
                </label>
                <ControlledFileUploadField
                  id="individual-inspiration"
                  label="Zdjęcia inspiracji"
                  hint="Maks. 2 pliki łącznie (JPG, PNG, WebP, do 5 MB)."
                  multiple
                  files={files.inspirationFiles}
                  onChange={(next) => setFiles((prev) => ({ ...prev, inspirationFiles: next }))}
                />
                <ControlledFileUploadField
                  id="individual-couplePhotos"
                  label="Zdjęcia pary do grafiki"
                  hint="Pliki w ramach wspólnego limitu 2 grafik na formularz."
                  multiple
                  files={files.couplePhotoFiles}
                  onChange={(next) => setFiles((prev) => ({ ...prev, couplePhotoFiles: next }))}
                />
                <p className={hintClass}>Łącznie możesz przesłać maksymalnie 2 pliki graficzne.</p>
              </>
            ) : null}
          </div>
        </>
      )}

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
          {pending ? "Wysyłanie…" : `Wyślij — ${getInquiryModeLabel(draft.mode)}`}
        </button>
      </div>
    </form>
  );
}
