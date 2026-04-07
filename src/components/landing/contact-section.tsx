import Link from "next/link";
import { WeddingFlourish } from "./wedding-flourish";

export function ContactSection() {
  return (
    <section
      id="kontakt"
      className="relative scroll-mt-20 border-t border-rose-100/90 bg-white px-4 py-20 sm:px-6"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-b from-transparent via-white to-rose-50/20" />
      <div className="relative mx-auto max-w-6xl">
        <WeddingFlourish />
        <h2 className="mt-4 text-center text-3xl font-semibold tracking-tight text-zinc-900">
          Kontakt
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-zinc-600">
          Masz pytanie o wizytówkę, termin lub własną domenę? Napisz — odpowiemy
          możliwie szybko.
        </p>
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/80 to-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-900/90">
              Zapytanie o stronę
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Najwygodniej przez formularz — dostaniesz numer referencyjny i link do
              statusu.
            </p>
            <Link
              href="/zloz-zapytanie"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
            >
              Przejdź do formularza
            </Link>
          </div>
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
              Autor rozwiązania
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Projekt i rozwój strony: zespół{" "}
              <a
                href="https://rabiegadevelopment.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-rose-800 underline-offset-2 hover:text-rose-950 hover:underline"
              >
                rabiegadevelopment.pl
              </a>
              . Tam znajdziesz też inne realizacje i kontakt bezpośredni.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
