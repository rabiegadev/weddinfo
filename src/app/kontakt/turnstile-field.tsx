"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { labelClass } from "./form-ui";

type TurnstileRenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  theme?: "auto" | "light" | "dark";
  language?: string;
};

type TurnstileApi = {
  render: (element: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type TurnstileFieldProps = {
  siteKey: string;
  /** Wywoływane przy uzyskaniu / utracie tokenu. Powinno być stabilne (useCallback). */
  onToken: (token: string) => void;
};

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function TurnstileField({ siteKey, onToken }: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const markReady = useCallback(() => setScriptReady(true), []);

  useEffect(() => {
    if (window.turnstile) {
      setScriptReady(true);
    }
  }, []);

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.turnstile) return;

    const api = window.turnstile;
    const id = api.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token) => onToken(token),
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
      theme: "auto",
      language: "pl",
    });
    widgetIdRef.current = id;

    return () => {
      if (widgetIdRef.current) {
        api.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [scriptReady, siteKey, onToken]);

  return (
    <div className="rounded border border-[var(--border-light)] bg-[var(--bg-light)]/50 p-4">
      <p className={labelClass}>Weryfikacja</p>
      <Script src={SCRIPT_SRC} strategy="afterInteractive" onLoad={markReady} onReady={markReady} />
      <div ref={containerRef} className="mt-3" />
    </div>
  );
}
