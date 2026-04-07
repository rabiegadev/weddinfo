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
      className="relative scroll-mt-20 bg-gradient-to-b from-[#faf8f7] via-rose-50/35 to-[#faf8f7] px-4 py-20 sm:px-6"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] bg-[radial-gradient(ellipse_at_30%_20%,_rgb(254_205_211/0.5)_0%,_transparent_55%),radial-gradient(ellipse_at_70%_80%,_rgb(254_243_199/0.4)_0%,_transparent_50%)]" />
      <div className="relative mx-auto max-w-6xl">
        <SectionDivider />
        <h2 className="mt-4 text-center text-3xl font-semibold tracking-tight text-zinc-900">
          Opinie par
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-zinc-600">
          Krótkie głosy od osób, które chciały uporządkować komunikację z gośćmi —
          przykładowe cytaty na potrzeby prezentacji strony.
        </p>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <li
              key={q.who}
              className="flex flex-col rounded-2xl border border-white/80 bg-white/75 p-6 shadow-sm shadow-rose-900/[0.04] backdrop-blur-sm"
            >
              <div className="flex gap-0.5 text-amber-400" aria-hidden>
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-zinc-700">
                „{q.text}”
              </blockquote>
              <footer className="mt-6 flex items-center gap-3 border-t border-rose-100/80 pt-4">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-amber-50 text-sm font-semibold text-rose-900"
                  aria-hidden
                >
                  {q.initial}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">{q.who}</p>
                  <p className="text-xs text-zinc-500">{q.role}</p>
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
