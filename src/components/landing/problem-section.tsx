import Image from "next/image";
import { LandingSectionInner } from "./landing-section-inner";

const questions = [
  "O której jest ślub?",
  "Czy są noclegi?",
  "Gdzie wrzucicie zdjęcia?",
  "Jak dojechać do sali?",
  "Do kiedy potwierdzić obecność?",
] as const;

export function ProblemSection() {
  return (
    <section
      id="o-nas"
      className="scroll-mt-header grid bg-[var(--bg-white)] lg:grid-cols-2 lg:items-stretch"
      aria-labelledby="problem-heading"
    >
      <LandingSectionInner className="flex flex-col justify-center py-16 sm:py-20 lg:py-24">
        <div className="text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)] sm:text-base">
            Ile razy usłyszycie?
          </p>
          <ul className="mt-8 space-y-4">
            {questions.map((q) => (
              <li key={q} className="flex items-start gap-3 text-lg text-[var(--text-dark)] sm:text-xl">
                <span className="mt-1 shrink-0 text-[var(--gold)]" aria-hidden>
                  ✓
                </span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
          <h2
            id="problem-heading"
            className="font-wedinfo-serif mt-12 text-4xl font-medium leading-[1.1] text-[var(--text-dark)] sm:text-5xl lg:text-[3.25rem]"
          >
            Jedna strona rozwiązuje wszystko
          </h2>
          <div className="mt-10 max-w-xl border-l-2 border-[var(--gold)] py-1 pl-6 sm:pl-8">
            <p className="font-wedinfo-serif text-xl leading-snug text-[var(--text-dark)] sm:text-2xl">
              Oszczędź czas na odpowiadaniu na powtarzające się pytania.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
              Udostępnij gościom stronę, na której znajdą{" "}
              <span className="text-[var(--text-dark)]">wszystkie niezbędne informacje</span> dotyczące
              Waszego ślubu i wesela.
            </p>
          </div>
        </div>
      </LandingSectionInner>

      <div className="relative min-h-[min(72vw,420px)] w-full lg:min-h-full lg:h-auto">
        <Image
          src="/images/zaproszenie.png"
          alt="Zaproszenie ślubne, koperta i obrączki"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}
