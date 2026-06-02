"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldError, inputClass, labelClass } from "./form-ui";

type CaptchaState = {
  question: string;
  token: string;
};

export function CaptchaField({ error }: { error?: string }) {
  const [captcha, setCaptcha] = useState<CaptchaState | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/captcha", { cache: "no-store" });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as CaptchaState;
      setCaptcha(data);
    } catch {
      setLoadError("Nie udało się wczytać captcha.");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div className="rounded border border-[var(--border-light)] bg-[var(--bg-light)]/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="captcha-answer" className={labelClass}>
          Weryfikacja
        </label>
        <button type="button" onClick={() => void refresh()} className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--gold)]">
          Odśwież
        </button>
      </div>
      {loadError ? <FieldError message={loadError} /> : null}
      {captcha ? (
        <>
          <p className="text-sm text-[var(--text-dark)]">{captcha.question}</p>
          <input type="hidden" name="captchaToken" value={captcha.token} />
          <input
            id="captcha-answer"
            name="captchaAnswer"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            required
            className={`${inputClass} mt-3 max-w-[160px]`}
          />
        </>
      ) : null}
      <FieldError message={error} />
    </div>
  );
}
