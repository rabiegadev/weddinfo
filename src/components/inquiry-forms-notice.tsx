"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "weddinfo-inquiry-forms-notice";

/**
 * Jednorazowe powiadomienie na stronie kontaktu — formularze pakietów są tymczasowo niedostępne.
 */
export function InquiryFormsNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      // Brak dostępu do localStorage — chowamy mimo to.
    }
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-4 sm:px-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--bg-dark)]/45 backdrop-blur-[2px] motion-reduce:transition-none"
        aria-label="Zamknij powiadomienie"
        onClick={dismiss}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-live="polite"
        aria-labelledby="inquiry-notice-title"
        className="inquiry-notice-dialog relative z-[1] w-full max-w-md border border-[var(--border-light)] bg-[var(--bg-white)] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.18)] sm:p-8"
      >
        <p
          id="inquiry-notice-title"
          className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]"
        >
          Informacja
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-dark)]">
          Formularze zapytań o pakiety (Individual, Premium) nie są jeszcze dostępne — pracujemy nad tą
          funkcjonalnością.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          Na ten moment możesz wysłać wiadomość przez formularz kontaktowy poniżej. Odpowiemy w ciągu 1–2 dni
          roboczych.
        </p>
        <button type="button" onClick={dismiss} className="btn-primary mt-6 w-full">
          Rozumiem
        </button>
      </div>
    </div>
  );
}
