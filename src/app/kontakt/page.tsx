import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";
import { SubpageHero } from "@/components/subpage-hero";
import { RESPONSE_TIME_LABEL } from "@/config/inquiry-tabs";
import { InquiryFormsShell } from "./inquiry-forms-shell";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Formularz Weddinfo: Individual, Premium lub kontakt ogólny. Otrzymasz numer zgłoszenia i hasło do statusu.",
};

export default function KontaktPage() {
  return (
    <div className="flex flex-1 flex-col pb-24 md:pb-0">
      <SubpageHero>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)] sm:mt-8">Kontakt</p>
        <h1 className="font-wedinfo-serif mt-4 text-3xl font-medium sm:text-4xl lg:text-5xl">Złóż zapytanie</h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
          Wybierz Individual, Premium lub napisz krótką wiadomość. Po wysłaniu otrzymasz e-mail z numerem zgłoszenia
          i hasłem do statusu ({RESPONSE_TIME_LABEL}).
        </p>
      </SubpageHero>

      <section className="bg-white py-14 sm:py-20" aria-labelledby="kontakt-form-heading">
        <LandingSectionInner>
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <h2
                id="kontakt-form-heading"
                className="font-wedinfo-serif text-2xl font-medium text-[var(--text-dark)] sm:text-3xl"
              >
                Formularz
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
                Wypełnione pola są zapamiętywane w tej sesji — możesz przełączać pakiet bez utraty danych. Wyczyść
                formularz, aby zacząć od nowa.
              </p>
              <Link
                href="/zapytanie"
                className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--gold)] transition-opacity hover:opacity-80"
              >
                Masz już numer? Sprawdź status →
              </Link>
            </div>

            <div className="border border-[var(--border-light)] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-8 lg:p-10">
              <Suspense fallback={<p className="text-center text-sm text-[var(--text-muted)]">Ładowanie formularza…</p>}>
                <InquiryFormsShell />
              </Suspense>
            </div>
          </div>
        </LandingSectionInner>
      </section>

      <section className="bg-[var(--bg-dark)] py-16 text-center sm:py-20">
        <LandingSectionInner>
          <p className="font-wedinfo-serif text-2xl text-[var(--gold)] sm:text-3xl">
            Nie wiesz, który pakiet wybrać?
          </p>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/55">
            Porównaj zakres usług na stronie cennika — wrócisz tutaj z zachowanymi danymi w formularzu.
          </p>
          <Link href="/cennik" className="btn-primary mt-8">
            Zobacz cennik
          </Link>
        </LandingSectionInner>
      </section>
    </div>
  );
}
