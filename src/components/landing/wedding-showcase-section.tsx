"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SectionDivider } from "@/components/landing/section-divider";
import { SectionTexture } from "@/components/landing/section-texture";

const timeline = [
  { time: "15:30", label: "Ceremonia" },
  { time: "17:00", label: "Życzenia" },
  { time: "18:00", label: "Przejazd do sali weselnej" },
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
      className={`wedinfo-showcase relative scroll-mt-20 overflow-hidden border-t border-[var(--w-gold-deep)]/12 px-4 py-20 sm:px-6 ${on ? "wedinfo-showcase-on" : ""}`}
      aria-labelledby="wedinfo-showcase-heading"
    >
      <SectionTexture variant="paper" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionDivider className="w-[min(100%,24rem)]" />
        <p className="mt-5 text-center text-xs font-medium uppercase tracking-[0.22em] text-[var(--w-gold-deep)]">
          Na wizytówce weselnej
        </p>
        <h2
          id="wedinfo-showcase-heading"
          className="font-wedinfo-serif mt-3 text-center text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl"
        >
          Fragmenty, które goście widzą pierwsze
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-[var(--foreground)]/72 sm:text-base">
          Poniżej przykładowe animacje — na Twojej stronie ustalicie z nami dokładne godziny, adresy i
          pytania w RSVP.
        </p>

        <div className="mt-16 grid gap-14 lg:grid-cols-3 lg:gap-10">
          {/* Harmonogram */}
          <div className="flex flex-col">
            <h3 className="font-wedinfo-serif text-lg font-semibold text-[var(--foreground)]">
              Harmonogram dnia
            </h3>
            <p className="mt-1 text-sm text-[var(--foreground)]/65">
              Oś czasu z punktami — czytelniej niż zrzuty z kalendarza.
            </p>
            <div className="relative mt-8 pl-2">
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
          <div className="flex flex-col">
            <h3 className="font-wedinfo-serif text-lg font-semibold text-[var(--foreground)]">Dojazd</h3>
            <p className="mt-1 text-sm text-[var(--foreground)]/65">
              Monochromatyczna mapka w tonacji strony — punkt A i B oraz przejazd.
            </p>
            <div className="mt-8 flex flex-1 items-center justify-center">
              <svg
                viewBox="0 0 220 160"
                className="h-auto w-full max-w-[260px]"
                fill="none"
                aria-label="Schemat: miejsce ślubu, sala weselna i trasa"
              >
                <defs>
                  <linearGradient id={`${routeId}-blk`} x1="0" y1="0" x2="220" y2="160">
                    <stop stopColor="var(--w-gold-deep)" stopOpacity="0.12" />
                    <stop offset="1" stopColor="var(--w-gold-deep)" stopOpacity="0.22" />
                  </linearGradient>
                </defs>
                <rect width="220" height="160" rx="14" fill={`url(#${routeId}-blk)`} />
                <path
                  d="M20 120h180M40 40h140M0 80h220"
                  stroke="var(--w-gold-deep)"
                  strokeOpacity="0.14"
                  strokeWidth="1"
                />
                <path
                  d="M30 130 L55 95 L95 88 L130 62 L175 48"
                  stroke="var(--w-gold-deep)"
                  strokeOpacity="0.2"
                  strokeWidth="0.9"
                  strokeDasharray="4 5"
                />
                <path
                  className="wedinfo-map-route"
                  d="M52 102 Q108 108 168 58"
                  stroke="var(--w-gold-deep)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="120"
                  strokeDashoffset="120"
                />
                <g className="wedinfo-map-a">
                  <circle cx="52" cy="102" r="9" fill="var(--w-cream-a)" stroke="var(--w-gold-deep)" strokeWidth="1.8" />
                  <text
                    x="52"
                    y="106"
                    textAnchor="middle"
                    fill="var(--w-gold-deep)"
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    A
                  </text>
                </g>
                <g className="wedinfo-map-b">
                  <circle cx="168" cy="58" r="9" fill="var(--w-cream-a)" stroke="var(--w-gold-deep)" strokeWidth="1.8" />
                  <text
                    x="168"
                    y="62"
                    textAnchor="middle"
                    fill="var(--w-gold-deep)"
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    B
                  </text>
                </g>
                <text
                  x="52"
                  y="125"
                  textAnchor="middle"
                  fill="#3d3429"
                  fillOpacity={0.45}
                  style={{ fontSize: "9px" }}
                >
                  ślub
                </text>
                <text
                  x="168"
                  y="78"
                  textAnchor="middle"
                  fill="#3d3429"
                  fillOpacity={0.45}
                  style={{ fontSize: "9px" }}
                >
                  sala
                </text>
              </svg>
            </div>
          </div>

          {/* RSVP */}
          <div className="flex flex-col">
            <h3 className="font-wedinfo-serif text-lg font-semibold text-[var(--foreground)]">
              Potwierdzenie obecności
            </h3>
            <p className="mt-1 text-sm text-[var(--foreground)]/65">
              Gość zaznacza odpowiedzi — bez lawiny wiadomości do pary młodej.
            </p>
            <div className="mt-8 rounded-2xl border border-[var(--w-gold-deep)]/18 bg-white/55 p-5 shadow-sm backdrop-blur-sm">
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
                      className="flex w-full cursor-pointer items-start gap-3 rounded-xl border border-transparent px-1 py-1.5 text-left text-sm text-[var(--foreground)]/85 transition hover:bg-[var(--w-cream-a)]/80 disabled:cursor-default disabled:opacity-90"
                    >
                      <span
                        className={`mt-0.5 flex size-[1.15rem] shrink-0 items-center justify-center rounded border-2 transition ${
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
                className="mt-5 w-full rounded-full bg-gradient-to-r from-[var(--w-gold-deep)] to-[var(--w-gold-soft-b)] py-2.5 text-sm font-semibold text-white shadow-md shadow-[var(--w-gold-deep)]/15 transition hover:brightness-105 disabled:cursor-default disabled:opacity-75"
              >
                {sent ? "Wysłano" : "Wyślij odpowiedź"}
              </button>
              <p
                className={`mt-3 min-h-[2.75rem] text-center text-xs leading-relaxed text-[var(--foreground)]/55 transition ${sent ? "opacity-100" : "opacity-0"}`}
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
