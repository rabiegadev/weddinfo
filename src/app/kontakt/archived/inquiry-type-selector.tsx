"use client";

import type { InquiryFormMode } from "@/config/inquiry-tabs";

const options: {
  id: InquiryFormMode;
  title: string;
  subtitle: string;
  description: string;
}[] = [
  {
    id: "individual",
    title: "Individual",
    subtitle: "Projekt od zera",
    description: "Pełny brief, wizualia, inspiracje i opcje dodatkowe.",
  },
  {
    id: "premium",
    title: "Premium",
    subtitle: "Pakiet Premium",
    description: "Szablon z listy, dopasowanie treści, RSVP i kod QR.",
  },
  {
    id: "contact",
    title: "Kontakt",
    subtitle: "Pytanie ogólne",
    description: "Krótka wiadomość bez pełnego briefu weselnego.",
  },
];

type InquiryTypeSelectorProps = {
  value: InquiryFormMode;
  onChange: (mode: InquiryFormMode) => void;
};

export function InquiryTypeSelector({ value, onChange }: InquiryTypeSelectorProps) {
  return (
    <fieldset>
      <legend className="sr-only">Rodzaj formularza</legend>
      <div className="grid gap-4 sm:grid-cols-3">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={selected}
              className={`touch-manipulation rounded-none border p-5 text-left transition ${
                selected
                  ? "border-[var(--gold)] bg-[var(--bg-light)] shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-[var(--gold)]"
                  : "border-[var(--border-light)] bg-white hover:border-[var(--gold)]/60"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                {option.subtitle}
              </span>
              <span className="font-wedinfo-serif mt-2 block text-xl text-[var(--text-dark)]">
                {option.title}
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-[var(--text-muted)]">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function getInquiryModeLabel(mode: InquiryFormMode): string {
  return options.find((o) => o.id === mode)?.title ?? mode;
}
