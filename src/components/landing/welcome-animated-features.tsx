"use client";

import { useEffect, useRef, useState } from "react";

const scheduleStroke = 72;
const routeStroke = 48;
const rsvpStroke = 56;

export function WelcomeAnimatedFeatures() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setOn(true);
      },
      { rootMargin: "-6% 0px -6% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`wedinfo-feat-animate relative mx-auto flex max-w-5xl flex-col px-4 py-16 sm:px-6 sm:py-20 ${on ? "wedinfo-feat-on" : ""}`}
    >
      <p className="text-center text-xs font-medium uppercase tracking-[0.22em] text-[var(--w-gold-deep)]">
        Wizytówka weselna
      </p>
      <h2 className="font-wedinfo-serif mt-3 text-center text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
        Co znajdą na niej goście
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-[var(--foreground)]/72 sm:text-base">
        Trzy elementy, które zwykle rozlatują się po czatach — tutaj są uporządkowane i zawsze pod tym samym linkiem.
      </p>

      <ul className="mt-14 grid gap-12 sm:grid-cols-3 sm:gap-8">
        <li className="flex flex-col items-center text-center">
          <div
            className="wedinfo-feat-pop flex h-36 w-full max-w-[220px] items-center justify-center opacity-0"
            style={{ animationDelay: on ? "0.05s" : "0s" }}
          >
            <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" aria-hidden>
              <rect
                x="16"
                y="18"
                width="88"
                height="88"
                rx="12"
                className="wedinfo-feat-float"
                fill="rgba(250,246,238,0.9)"
                stroke="var(--w-gold-deep)"
                strokeOpacity="0.35"
                strokeWidth="1"
              />
              <path
                className="wedinfo-feat-draw"
                d="M60 32v56M60 32l-12 12M60 32l12 12"
                stroke="var(--w-gold-deep)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={scheduleStroke}
                strokeDashoffset={scheduleStroke}
                style={{ animationDelay: on ? "0.15s" : "0s" }}
              />
              <circle cx="60" cy="92" r="5" fill="var(--w-gold-soft-b)" opacity="0.85" />
              <circle cx="60" cy="64" r="4" fill="var(--w-texture-gold)" opacity="0.5" />
              <circle cx="60" cy="48" r="3" fill="var(--w-mauve)" opacity="0.45" />
            </svg>
          </div>
          <h3 className="font-wedinfo-serif mt-5 text-lg font-semibold text-[var(--foreground)]">
            Harmonogram
          </h3>
          <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-[var(--foreground)]/68">
            Godziny ceremonii, przyjęcia i ważne punkty dnia — czytelna oś czasu zamiast zrzutów ekranu.
          </p>
        </li>

        <li className="flex flex-col items-center text-center">
          <div
            className="wedinfo-feat-pop flex h-36 w-full max-w-[220px] items-center justify-center opacity-0"
            style={{ animationDelay: on ? "0.2s" : "0s" }}
          >
            <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" aria-hidden>
              <rect
                x="16"
                y="18"
                width="88"
                height="88"
                rx="12"
                fill="rgba(250,246,238,0.9)"
                stroke="var(--w-gold-deep)"
                strokeOpacity="0.35"
                strokeWidth="1"
              />
              <path
                className="wedinfo-feat-draw"
                d="M44 88 L76 50 L94 68 L58 94 Z"
                stroke="var(--w-gold-deep)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={routeStroke}
                strokeDashoffset={routeStroke}
                style={{ animationDelay: on ? "0.35s" : "0s" }}
              />
              <g className="wedinfo-feat-float" style={{ animationDelay: "0.5s" }}>
                <circle
                  className="wedinfo-feat-ring"
                  cx="76"
                  cy="50"
                  r="18"
                  stroke="var(--w-gold-soft-b)"
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.4"
                />
                <path
                  d="M76 38v7l5 5"
                  stroke="var(--w-gold-deep)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="76" cy="44" r="5" fill="var(--w-gold-deep)" opacity="0.9" />
              </g>
            </svg>
          </div>
          <h3 className="font-wedinfo-serif mt-5 text-lg font-semibold text-[var(--foreground)]">
            Dojazd
          </h3>
          <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-[var(--foreground)]/68">
            Adres sali, podpowiedź do parkingu i czasami link do mapy — w jednym bloku, zawsze aktualny.
          </p>
        </li>

        <li className="flex flex-col items-center text-center">
          <div
            className="wedinfo-feat-pop flex h-36 w-full max-w-[220px] items-center justify-center opacity-0"
            style={{ animationDelay: on ? "0.35s" : "0s" }}
          >
            <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" aria-hidden>
              <rect
                x="28"
                y="32"
                width="64"
                height="48"
                rx="6"
                className="wedinfo-feat-float"
                fill="rgba(255,255,255,0.95)"
                stroke="var(--w-gold-deep)"
                strokeOpacity="0.45"
                strokeWidth="1.2"
              />
              <path
                className="wedinfo-feat-draw"
                d="M40 46h40M40 56h28M40 66h34"
                stroke="var(--w-gold-soft-b)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={rsvpStroke}
                strokeDashoffset={rsvpStroke}
                style={{ animationDelay: on ? "0.45s" : "0s" }}
              />
              <path
                className="wedinfo-feat-draw"
                d="M48 82 L58 94 88 58"
                stroke="var(--w-gold-deep)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={36}
                strokeDashoffset={36}
                style={{ animationDelay: on ? "0.65s" : "0s" }}
              />
            </svg>
          </div>
          <h3 className="font-wedinfo-serif mt-5 text-lg font-semibold text-[var(--foreground)]">
            Potwierdzenie obecności
          </h3>
          <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-[var(--foreground)]/68">
            RSVP dla gości — kto będzie, ewentualnie uwagi kulinarnie — bez lawiny wiadomości do Pary Młodej.
          </p>
        </li>
      </ul>
    </div>
  );
}
