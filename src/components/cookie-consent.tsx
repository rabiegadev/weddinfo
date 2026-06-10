"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "weddinfo-cookie-consent";

/**
 * Subtelne, niewielkie powiadomienie o cookies.
 * Pojawia się raz — wybór zapisywany jest w localStorage.
 */
export function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const persist = (value: "accepted" | "essential") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Brak dostępu do localStorage (np. tryb prywatny) — chowamy mimo to.
    }
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  // Na stronie głównej (mobile) unosimy baner ponad przyklejony przycisk CTA.
  const mobileBottomOffset = pathname === "/" ? "mb-[5.25rem] md:mb-0" : "";

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-3 sm:justify-start sm:px-4 ${mobileBottomOffset}`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
    >
      <div
        role="dialog"
        aria-live="polite"
        aria-label="Informacja o plikach cookies"
        className="pointer-events-auto w-full max-w-sm border border-[var(--border-light)] bg-[var(--bg-white)]/95 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.14)] backdrop-blur-md sm:p-5"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
          Cookies
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-muted)]">
          Używamy plików cookies, aby strona działała poprawnie i była dla Was wygodniejsza. Szczegóły znajdziecie w{" "}
          <Link
            href="/polityka-prywatnosci"
            className="font-medium text-[var(--gold)] underline-offset-2 transition hover:underline"
          >
            polityce prywatności
          </Link>
          .
        </p>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => persist("accepted")}
            className="btn-primary min-h-9 flex-1 px-4 py-2 text-[11px]"
          >
            Akceptuję
          </button>
          <button
            type="button"
            onClick={() => persist("essential")}
            className="min-h-9 shrink-0 px-2 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)] transition hover:text-[var(--text-dark)]"
          >
            Tylko niezbędne
          </button>
        </div>
      </div>
    </div>
  );
}
