import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";
import { SubpageHero } from "@/components/subpage-hero";
import { cooperationSteps } from "@/data/cooperation-steps";

export const metadata: Metadata = {
  title: "Współpraca",
  description:
    "Zobacz, jak krok po kroku wygląda współpraca z Weddinfo — od formularza, przez akceptację i projekt, aż po publikację Waszej wizytówki weselnej.",
};

export default function WspolpracaPage() {
  return (
    <div className="flex flex-1 flex-col pb-24 md:pb-0">
      <SubpageHero>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)] sm:mt-8">
          Współpraca
        </p>
        <h1 className="font-wedinfo-serif mt-4 text-3xl font-medium sm:text-4xl lg:text-5xl">
          Jak wygląda współpraca?
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
          Cały proces jest prosty i przejrzysty — prowadzimy Was za rękę od pierwszego zgłoszenia aż po gotową stronę
          dla gości.
        </p>
      </SubpageHero>

      <section className="bg-white py-14 sm:py-20" aria-labelledby="wspolpraca-steps-heading">
        <LandingSectionInner>
          <h2 id="wspolpraca-steps-heading" className="sr-only">
            Etapy współpracy
          </h2>
          <ol className="grid gap-12 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-6 xl:gap-8">
            {cooperationSteps.map((step, index) => (
              <li key={step.num} className="relative flex flex-col">
                {index < cooperationSteps.length - 1 ? (
                  <span
                    className="pointer-events-none absolute top-11 left-[calc(50%+2.75rem)] hidden h-px w-[calc(100%-5.5rem)] bg-[var(--gold-line)] lg:block"
                    aria-hidden
                  />
                ) : null}
                <div className="flex size-[4.5rem] items-center justify-center rounded-full border border-[var(--gold-line)] bg-[var(--bg-white)] sm:size-20">
                  <Image
                    src={step.icon}
                    alt=""
                    width={48}
                    height={48}
                    className="size-10 object-contain sm:size-12"
                  />
                </div>
                <p className="mt-5 text-sm font-semibold tracking-[0.2em] text-[var(--gold)]">{step.num}</p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--text-dark)]">{step.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-[var(--text-muted)]">{step.description}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex flex-col items-center gap-4 border-t border-[var(--border-light)] pt-10 sm:mt-16 sm:flex-row sm:justify-center sm:gap-5">
            <Link href="/kontakt" className="btn-primary w-full sm:w-auto">
              Wypełnij formularz
            </Link>
            <Link href="/zapytanie" className="btn-secondary w-full sm:w-auto">
              Sprawdź status zlecenia
            </Link>
          </div>
        </LandingSectionInner>
      </section>

      <section className="bg-[var(--bg-dark)] py-16 text-center sm:py-20">
        <LandingSectionInner>
          <p className="font-wedinfo-serif text-2xl text-[var(--gold)] sm:text-3xl">
            Gotowi, by zacząć?
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/55">
            Napiszcie do nas, a dobierzemy pakiet idealnie dopasowany do Waszego wesela.
          </p>
          <Link href="/cennik" className="btn-primary mt-8">
            Zobacz cennik
          </Link>
        </LandingSectionInner>
      </section>
    </div>
  );
}
