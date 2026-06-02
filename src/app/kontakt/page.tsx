import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";
import { RESPONSE_TIME_LABEL } from "@/config/inquiry-tabs";
import { InquiryFormsShell } from "./inquiry-forms-shell";

export const metadata: Metadata = {
  title: "Kontakt i formularze",
  description:
    "Formularze Weddinfo: Individual, Premium, Basic oraz kontakt ogólny. Otrzymasz numer zgłoszenia i hasło do statusu.",
};

export default function KontaktPage() {
  return (
    <div className="flex flex-1 flex-col pb-24 md:pb-0">
      <section className="relative overflow-hidden bg-[var(--bg-dark)] text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src="/images/napisz.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_40%]"
          />
        </div>
        <div className="absolute inset-0 bg-[var(--bg-dark)]/82" aria-hidden />
        <LandingSectionInner className="relative z-10 py-16 text-center sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">Kontakt</p>
          <h1 className="font-wedinfo-serif mt-4 text-3xl font-medium sm:text-4xl lg:text-5xl">
            Formularze i wycena
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            Wybierz zakładkę dopasowaną do pakietu. Po wysłaniu otrzymasz e-mail z numerem zgłoszenia, hasłem do statusu
            oraz przewidywanym czasem odpowiedzi ({RESPONSE_TIME_LABEL}).
          </p>
        </LandingSectionInner>
      </section>

      <section className="bg-[var(--bg-white)] py-14 sm:py-20">
        <LandingSectionInner>
          <div className="grid gap-12 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] xl:gap-16">
            <aside className="space-y-8">
              <div>
                <h2 className="font-wedinfo-serif text-2xl font-medium text-[var(--text-dark)] sm:text-3xl">
                  Który formularz wybrać?
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                  <strong className="text-[var(--text-dark)]">Individual</strong> — projekt od zera z pełnym briefem.
                  <strong className="mt-2 block text-[var(--text-dark)]">Premium / Basic</strong> — pakiety z listy
                  szablonów. <strong className="mt-2 block text-[var(--text-dark)]">Kontakt</strong> — krótkie pytanie.
                </p>
              </div>
              <ul className="space-y-6 border-t border-[var(--border-light)] pt-8 text-sm text-[var(--text-muted)]">
                <li>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">Status</span>
                  <p className="mt-2">
                    Każde zgłoszenie ma unikalny numer i hasło — sprawdzisz postęp na stronie statusu (wkrótce także
                    korespondencja).
                  </p>
                  <Link
                    href="/zapytanie"
                    className="mt-2 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-dark)] hover:text-[var(--gold)]"
                  >
                    Sprawdź status →
                  </Link>
                </li>
                <li>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">Oferta</span>
                  <p className="mt-2">Porównaj pakiety i zakres usług przed wysłaniem formularza.</p>
                  <Link
                    href="/oferta"
                    className="mt-2 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-dark)] hover:text-[var(--gold)]"
                  >
                    Zobacz ofertę →
                  </Link>
                </li>
              </ul>
            </aside>

            <div className="border border-[var(--border-light)] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-8 lg:p-10">
              <Suspense fallback={<p className="text-sm text-[var(--text-muted)]">Ładowanie formularzy…</p>}>
                <InquiryFormsShell />
              </Suspense>
            </div>
          </div>
        </LandingSectionInner>
      </section>
    </div>
  );
}
