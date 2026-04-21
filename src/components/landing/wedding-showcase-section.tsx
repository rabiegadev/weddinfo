"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SectionDivider } from "@/components/landing/section-divider";
import { SectionTexture } from "@/components/landing/section-texture";

const timeline = [
  { time: "15:30", label: "Ceremonia" },
  { time: "17:00", label: "Życzenia" },
  { time: "18:00", label: "Przejazd do sali weselnej" },
  { time: "19:30", label: "Pierwszy taniec" },
  { time: "00:30", label: "Zakończenie przyjęcia" },
] as const;

export function WeddingShowcaseSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  const routeId = useId().replace(/:/g, "");

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setOn(true);
      },
      { rootMargin: "-5% 0px -8% 0px", threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [checks, setChecks] = useState([false, false, false]);
  const [sent, setSent] = useState(false);

  const toggleCheck = (i: number) => {
    if (sent) return;
    setChecks((c) => {
      const n = [...c];
      n[i] = !n[i];
      return n;
    });
  };

  const sendDemo = () => {
    setSent(true);
  };

  return (
    <section
      ref={rootRef}
      id="wizytowka-wesela"
      className={`wedinfo-showcase scroll-mt-header relative overflow-hidden border-t border-[var(--w-gold-deep)]/12 px-4 py-16 sm:px-6 sm:py-20 ${on ? "wedinfo-showcase-on" : ""}`}
      aria-labelledby="wedinfo-showcase-heading"
    >
      <SectionTexture variant="paper" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionDivider className="w-[min(100%,24rem)]" />
        <h2
          id="wedinfo-showcase-heading"
          className="font-wedinfo-serif mt-5 text-balance text-center text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:mt-6 sm:text-3xl md:text-4xl"
        >
          Sprawdź co znajdzie się na stronie
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-pretty text-center text-sm leading-relaxed text-[var(--foreground)]/72 sm:text-base">
          Możemy umieścić spersonalizowany harmonogram, mapę dojazdu wraz ze szczegółami niezbędnymi, aby
          dojechać we właściwe miejsce, potwierdzenie obecności ze spersonalizowanymi opcjami do wyboru,
          przekierowania do galerii, informacje kontaktowe i nie tylko.
        </p>

        <div className="mt-16 grid min-w-0 gap-14 lg:grid-cols-3 lg:items-stretch lg:gap-10">
          {/* Harmonogram */}
          <div className="flex h-full flex-col items-center">
            <h3 className="font-wedinfo-serif text-center text-lg font-semibold text-[var(--foreground)]">
              Harmonogram wesela
            </h3>
            <div className="relative mt-6 w-full max-w-[300px] flex-1 rounded-2xl border border-[var(--w-gold-deep)]/16 bg-white/55 p-4 pl-6 shadow-sm backdrop-blur-sm lg:mt-8 min-h-[340px]">
              <div
                className="wedinfo-tl-line absolute bottom-2 left-[15px] top-2 w-px origin-top bg-[var(--w-gold-deep)]/35"
                aria-hidden
              />
              <ul className="relative space-y-8">
                {timeline.map((item, i) => (
                  <li
                    key={item.label}
                    className="wedinfo-tl-item relative flex gap-4 pl-10"
                    style={{ animationDelay: `${0.15 + i * 0.38}s` }}
                  >
                    <span
                      className="wedinfo-tl-dot absolute left-[10px] top-1.5 size-3 rounded-full border-2 border-[var(--w-gold-deep)]/50 bg-[var(--w-cream-a)] shadow-sm"
                      aria-hidden
                    />
                    <div>
                      <p className="font-wedinfo-serif text-lg font-semibold text-[var(--w-gold-deep)]">
                        {item.time}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">{item.label}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mapa dojazdu */}
          <div className="flex h-full flex-col items-center">
            <h3 className="font-wedinfo-serif text-center text-lg font-semibold text-[var(--foreground)]">
              Instrukcje dojazdu
            </h3>
            <div className="mt-6 w-full max-w-[300px] flex-1 rounded-2xl border border-[var(--w-gold-deep)]/16 bg-white/55 p-4 shadow-sm backdrop-blur-sm lg:mt-8 min-h-[340px]">
              <svg
                viewBox="0 0 290 340"
                className="h-full w-full"
                fill="none"
                aria-label="Schemat: miejsce ślubu, sala weselna i trasa"
              >
                <defs>
                  <linearGradient id={`${routeId}-bg`} x1="0" y1="0" x2="290" y2="340">
                    <stop stopColor="var(--w-gold-deep)" stopOpacity="0.1" />
                    <stop offset="1" stopColor="var(--w-gold-deep)" stopOpacity="0.18" />
                  </linearGradient>
                </defs>
                <rect x="8" y="8" width="274" height="324" rx="16" fill={`url(#${routeId}-bg)`} fillOpacity="0.14" />
                <text x="18" y="30" fill="#3d3429" style={{ fontSize: "14px", fontWeight: 600 }}>
                  Wesele odbędzie się w
                </text>
                <text
                  x="18"
                  y="54"
                  fill="#3d3429"
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: "17px",
                    fontWeight: 700,
                  }}
                >
                  Radwanów 36, 67-120 Radwanów
                </text>
                <rect x="18" y="74" width="254" height="212" rx="14" fill="white" fillOpacity="0.22" />
                <path d="M30 108 C88 88 124 116 176 102 C210 94 236 80 264 90" stroke="var(--w-gold-deep)" strokeOpacity="0.14" strokeWidth="7" strokeLinecap="round" />
                <path d="M26 160 C76 144 118 170 162 158 C210 146 238 158 266 146" stroke="var(--w-gold-deep)" strokeOpacity="0.14" strokeWidth="7" strokeLinecap="round" />
                <path d="M24 220 C64 202 108 224 144 212 C188 196 226 210 268 198" stroke="var(--w-gold-deep)" strokeOpacity="0.14" strokeWidth="7" strokeLinecap="round" />
                <path
                  className="wedinfo-map-route"
                  d="M50 250 C108 228 150 202 190 170 C216 150 238 128 254 112"
                  stroke="var(--w-gold-deep)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="320"
                  strokeDashoffset="320"
                />
                <g className="wedinfo-map-a">
                  <path
                    d="M50 228c-7 0-13 6-13 13 0 9 13 22 13 22s13-13 13-22c0-7-6-13-13-13z"
                    fill="white"
                    stroke="var(--w-gold-deep)"
                    strokeWidth="1.8"
                  />
                  <text
                    x="50"
                    y="247"
                    textAnchor="middle"
                    fill="var(--w-gold-deep)"
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    A
                  </text>
                </g>
                <g className="wedinfo-map-b">
                  <path
                    d="M254 90c-7 0-13 6-13 13 0 9 13 22 13 22s13-13 13-22c0-7-6-13-13-13z"
                    fill="white"
                    stroke="var(--w-gold-deep)"
                    strokeWidth="1.8"
                  />
                  <text
                    x="256"
                    y="109"
                    textAnchor="middle"
                    fill="var(--w-gold-deep)"
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    B
                  </text>
                </g>
                <text
                  x="54"
                  y="286"
                  fill="#3d3429"
                  fillOpacity={0.7}
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  Zielona Góra
                </text>
                <text
                  x="256"
                  y="137"
                  textAnchor="middle"
                  fill="#3d3429"
                  fillOpacity={0.7}
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  Radwanów
                </text>
                <text
                  x="164"
                  y="316"
                  textAnchor="middle"
                  fill="#3d3429"
                  fillOpacity={0.6}
                  style={{ fontSize: "14px" }}
                >
                  Jak dojechać z Zielonej Góry
                </text>
              </svg>
            </div>
          </div>

          {/* RSVP */}
          <div className="flex h-full flex-col items-center">
            <h3 className="font-wedinfo-serif text-center text-lg font-semibold text-[var(--foreground)]">
              Potwierdzenie obecności
            </h3>
            <div className="mt-6 flex w-full max-w-[300px] flex-1 flex-col rounded-2xl border border-[var(--w-gold-deep)]/16 bg-white/55 p-5 shadow-sm backdrop-blur-sm lg:mt-8 min-h-[340px]">
              <p className="mb-4 text-center text-sm font-semibold text-[var(--foreground)]/82">
                Czy będziesz obecny?
              </p>
              <ul className="space-y-3">
                {[
                  "Będę na ceremonii",
                  "Będę na przyjęciu weselnym",
                  "Zgłaszam preferencje dietetyczne",
                ].map((label, i) => (
                  <li key={label}>
                    <button
                      type="button"
                      disabled={sent}
                      onClick={() => toggleCheck(i)}
                      className="touch-manipulation flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent px-2 py-3 text-left text-base text-[var(--foreground)]/85 transition hover:bg-[var(--w-cream-a)]/80 active:bg-[var(--w-cream-a)]/60 disabled:cursor-default disabled:opacity-90 sm:text-sm [-webkit-tap-highlight-color:transparent]"
                    >
                      <span
                        className={`mt-0 flex size-5 shrink-0 items-center justify-center rounded border-2 transition ${
                          checks[i]
                            ? "border-[var(--w-gold-deep)] bg-[var(--w-gold-deep)]/12"
                            : "border-[var(--w-gold-deep)]/35 bg-white/80"
                        }`}
                        aria-hidden
                      >
                        <span
                          className={`text-[var(--w-gold-deep)] transition ${checks[i] ? "wedinfo-rsvp-tick scale-100 opacity-100" : "scale-50 opacity-0"}`}
                        >
                          ✓
                        </span>
                      </span>
                      <span>{label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={sendDemo}
                disabled={sent}
                className="touch-manipulation mt-auto min-h-12 w-full rounded-full bg-gradient-to-r from-[var(--w-gold-deep)] to-[var(--w-gold-soft-b)] py-3 text-base font-semibold text-white shadow-md shadow-[var(--w-gold-deep)]/15 transition hover:brightness-105 active:brightness-95 disabled:cursor-default disabled:opacity-75 sm:text-sm [-webkit-tap-highlight-color:transparent]"
              >
                {sent ? "Wysłano" : "Wyślij odpowiedź"}
              </button>
              <p
                className={`mt-2 mb-1 text-center text-xs leading-relaxed text-[var(--foreground)]/55 transition ${sent ? "opacity-100" : "opacity-0"}`}
                aria-live="polite"
              >
                Odpowiedź zapisana — w prawdziwej wizytówce trafi bezpośrednio do pary młodej (to tylko
                podgląd na stronie Weddinfo).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
