import Link from "next/link";
import { SectionDivider } from "./section-divider";

const examples = [
  {
    couple: "Kamila & Bartek",
    slug: "kamilaibartek",
    palette: "from-rose-100 to-amber-50",
    accent: "text-rose-900",
    date: "14 września",
  },
  {
    couple: "Ola & Michał",
    slug: "olaimichal",
    palette: "from-stone-100 to-neutral-100",
    accent: "text-stone-800",
    date: "6 lipca",
  },
  {
    couple: "Natalia & Paweł",
    slug: "nataliaipawel",
    palette: "from-fuchsia-50 to-rose-50",
    accent: "text-rose-950",
    date: "23 sierpnia",
  },
];

export function PortfolioSection() {
  return (
    <section
      id="realizacje"
      className="relative scroll-mt-20 border-t border-rose-100/80 bg-white/40 px-4 py-20 backdrop-blur-[2px] sm:px-6"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/80 to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        <SectionDivider />
        <h2 className="mt-4 text-center text-3xl font-semibold tracking-tight text-zinc-900">
          Przykładowe realizacje
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600">
          Tak mogą wyglądać gotowe wizytówki — spójna typografia, harmonogram,
          mapa i sekcja dla gości. Poniżej wersje demonstracyjne (adresy przykładowe).
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {examples.map((item) => (
            <article
              key={item.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-rose-100/90 bg-white/80 shadow-sm shadow-rose-900/5 transition hover:border-rose-200 hover:shadow-md"
            >
              <div
                className={`relative h-36 bg-gradient-to-br ${item.palette} px-4 pt-6`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
                <div className="relative flex items-start justify-between gap-2">
                  <div>
                    <p
                      className={`font-serif text-lg font-medium italic ${item.accent}`}
                    >
                      {item.couple}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                      {item.date}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500 backdrop-blur-sm">
                    Demo
                  </span>
                </div>
                {/* Mini „okno” strony */}
                <div className="relative mx-auto mt-4 h-14 w-[88%] rounded-t-lg border border-white/80 bg-white/90 px-3 pt-2 shadow-sm">
                  <div className="flex gap-1">
                    <span className="size-1.5 rounded-full bg-rose-200" />
                    <span className="size-1.5 rounded-full bg-amber-100" />
                    <span className="size-1.5 rounded-full bg-rose-50" />
                  </div>
                  <div className="mt-2 h-1.5 w-2/3 rounded bg-rose-100/80" />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <p className="text-xs text-zinc-500">
                  <span className="font-mono text-zinc-400">{item.slug}</span>
                  .weddinfo.pl
                </p>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Spersonalizowane kolory, sekcja RSVP i prosty harmonogram dnia —
                  wszystko w jednej, lekkiej stronie.
                </p>
                <div className="mt-auto pt-2">
                  <span className="text-sm font-medium text-rose-800/80">
                    Wkrótce podgląd na żywo
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-zinc-500">
          Chcesz podobną stronę?{" "}
          <Link href="/zloz-zapytanie" className="font-medium text-rose-800 underline-offset-2 hover:text-rose-950 hover:underline">
            Wypełnij krótki brief
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
