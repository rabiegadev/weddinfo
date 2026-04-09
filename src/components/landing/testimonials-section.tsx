import { SectionDivider } from "./section-divider";

const quotes = [
  {
    text: "Goście w końcu uwielbili jeden link zamiast dziesięciu wiadomości na Messengerze. Spokój przed ślubem — bezcenny.",
    who: "Magdalena K.",
    role: "ślub 2025",
    initial: "M",
  },
  {
    text: "Strona była gotowa szybciej niż zaproszenia z drukarni. Dobrze, że można było dodać nocleg i transport.",
    who: "Tomek W.",
    role: "ślub 2024",
    initial: "T",
  },
  {
    text: "Prosto, elegancko, działa na telefonach babci. Dokładnie tego szukaliśmy zamiast ciężkiego zaproszenia PDF.",
    who: "Anna & Kuba",
    role: "narzeczeni",
    initial: "A",
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="opinie"
      className="relative scroll-mt-20 bg-gradient-to-b from-[var(--w-cream-b)] via-[var(--w-pink-dust)]/25 to-[var(--w-cream-a)] px-4 py-20 sm:px-6"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 25% 25%, rgba(201,168,185,0.2) 0%, transparent 52%), radial-gradient(ellipse at 75% 70%, rgba(232,199,212,0.35) 0%, transparent 48%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <SectionDivider className="w-[min(100%,24rem)]" />
        <h2 className="font-wedinfo-serif mt-5 text-center text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
          Opinie par
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[var(--foreground)]/70">
          Krótkie głosy od osób, które chciały uporządkować komunikację z gośćmi —
          przykładowe cytaty na potrzeby prezentacji strony.
        </p>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <li
              key={q.who}
              className="flex flex-col rounded-2xl border border-white/90 bg-white/65 p-6 shadow-sm shadow-[var(--w-mauve)]/5 backdrop-blur-sm"
            >
              <div className="flex gap-0.5 text-[var(--w-gold-soft-b)]" aria-hidden>
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-[var(--foreground)]/78">
                „{q.text}”
              </blockquote>
              <footer className="mt-6 flex items-center gap-3 border-t border-[var(--w-gold-deep)]/12 pt-4">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--w-pink-dust)] to-[var(--w-cream-a)] text-sm font-semibold text-[var(--w-gold-deep)]"
                  aria-hidden
                >
                  {q.initial}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{q.who}</p>
                  <p className="text-xs text-[var(--foreground)]/50">{q.role}</p>
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
