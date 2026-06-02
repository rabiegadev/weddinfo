"use client";

import { useState, useTransition } from "react";
import { weddingTemplateOptions } from "@/data/wedding-templates";
import { submitInquiryForm, type SubmitInquiryResult } from "./actions";
import { CaptchaField } from "./captcha-field";
import {
  FileUploadField,
  FormSectionDivider,
  HoneypotField,
  YesNoField,
  hintClass,
  inputClass,
  labelClass,
  textareaClass,
} from "./form-ui";
import { WeddingBasicsFields } from "./wedding-basics-fields";
import { InquirySuccess } from "./inquiry-success";

type PackageInquiryFormProps = {
  variant: "premium" | "basic";
};

export function PackageInquiryForm({ variant }: PackageInquiryFormProps) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<SubmitInquiryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isPremium = variant === "premium";

  if (result?.ok) {
    return <InquirySuccess result={result} onReset={() => setResult(null)} />;
  }

  return (
    <form
      encType="multipart/form-data"
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const res = await submitInquiryForm(fd);
          if (!res.ok) {
            setError(res.error);
            return;
          }
          setResult(res);
        });
      }}
    >
      <input type="hidden" name="inquiryType" value={variant} />
      <HoneypotField />

      <div>
        <h3 className="font-wedinfo-serif text-xl font-medium text-[var(--text-dark)]">Dane podstawowe</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Pakiet {isPremium ? "Premium" : "Basic"} — wspólna część briefu weselnego.
        </p>
        <div className="mt-6">
          <WeddingBasicsFields />
        </div>
      </div>

      <FormSectionDivider
        title="Szablon i dopasowanie"
        subtitle="Wybór szablonu, kontakt i dodatkowe uwagi."
      />

      <div className="space-y-6">
        <div>
          <label htmlFor="clientEmail" className={labelClass}>
            E-mail kontaktowy
          </label>
          <input id="clientEmail" name="clientEmail" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="clientPhone" className={labelClass}>
            Telefon <span className="font-normal normal-case tracking-normal text-[var(--text-muted)]">(opcjonalnie)</span>
          </label>
          <input id="clientPhone" name="clientPhone" type="tel" autoComplete="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="templateName" className={labelClass}>
            Wybór szablonu
          </label>
          <select id="templateName" name="templateName" required className={inputClass} defaultValue="">
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
          <textarea id="additionalInfo" name="additionalInfo" rows={4} className={textareaClass} />
        </div>
        <div>
          <label htmlFor="correctionRequests" className={labelClass}>
            Prośby o drobne korekty
          </label>
          <textarea id="correctionRequests" name="correctionRequests" rows={3} className={textareaClass} />
        </div>

        {isPremium ? (
          <>
            <YesNoField name="wantsRsvp" label="Czy ma być RSVP?" notesName="rsvpNotes" notesLabel="Informacje do RSVP" />
            <YesNoField name="wantsQrCode" label="Czy ma być kod QR?" notesName="qrCodeNotes" notesLabel="Informacje do kodu QR" />
          </>
        ) : null}

        <FileUploadField
          name="couplePhotoFiles"
          label="Zdjęcia pary"
          hint="Maks. 2 pliki (JPG, PNG, WebP, do 5 MB łącznie)."
          multiple
        />
        <p className={hintClass}>{isPremium ? "Pakiet Premium obejmuje m.in. RSVP i kod QR." : "W pakiecie Basic pomijamy galerię, RSVP i kod QR."}</p>
      </div>

      <CaptchaField />
      {error ? (
        <p className="rounded border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto sm:min-w-[240px]">
        {pending ? "Wysyłanie…" : `Wyślij zapytanie ${isPremium ? "Premium" : "Basic"}`}
      </button>
    </form>
  );
}
