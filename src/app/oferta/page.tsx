import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Oferta — cennik, FAQ i współpraca",
  description:
    "Pakiety wizytówki weselnej Weddinfo, zakres usług, czas odpowiedzi (SLA), FAQ oraz przebieg współpracy.",
};

const nav = [
  { href: "#cennik", label: "Cennik" },
  { href: "#uslugi", label: "Usługi" },
  { href: "#co-dostajesz", label: "Co dostajesz" },
  { href: "#wspolpraca", label: "Współpraca" },
  { href: "#sla", label: "SLA" },
  { href: "#faq", label: "FAQ" },
] as const;

const steps = [
  {
    title: "Brief",
    body: "Wypełniasz formularz lub wysyłasz krótki opis potrzeb. Im więcej szczegółów, tym trafniejsza wycena.",
  },
  {
    title: "Propozycja",
    body: "Przygotowujemy zakres, terminy i warianty kolorystyczne / szablonu. Dopasowujemy RSVP i sekcje do Twojej sytuacji.",
  },
  {
    title: "Wdrożenie",
    body: "Budujemy wizytówkę, wgrają się treści, mapy, harmonogram. Przekazujemy link testowy i hasło do podglądu zapytania.",
  },
  {
    title: "Akceptacja",
    body: "Wspólnie dopracowujemy poprawki (w ramach pakietu). Po Twojej zgodzie publikujemy stronę pod docelowym adresem.",
  },
  {
    title: "Wesele + archiwum",
    body: "Strona działa dla gości. Po evencie możemy ustawić archiwum lub przekazać materiały — zgodnie z ustaleniami.",
  },
] as const;

export default function OfertaPage() {
  return (
    <div className="page-below-header mx-auto max-w-6xl px-4 pb-[calc(3rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:pb-14">
      <p className="mb-8 mt-1 text-sm">
        <Link href="/" className="text-rose-800 underline-offset-2 hover:underline dark:text-rose-200">
          ← Strona główna
        </Link>
      </p>

      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Oferta Weddinfo
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Poniżej znajdziesz orientacyjny cennik, zakres pakietów, to co realnie dostajesz po stronie
          technicznej, przebieg współpracy, czas odpowiedzi oraz najczęstsze pytania. Kwoty są
          przykładowe — ostateczna wycena po krótkim briefie.
        </p>
      </header>

      <nav
        aria-label="Sekcje oferty"
        className="sticky top-[max(3.5rem,env(safe-area-inset-top,0px))] z-30 mt-10 -mx-4 border-y border-zinc-200/80 bg-[var(--w-cream-b)]/95 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90 sm:-mx-6 sm:px-6"
      >
        <ul className="flex flex-wrap gap-2 text-sm font-medium">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-flex min-h-10 items-center rounded-full border border-zinc-300/80 bg-white/90 px-3 py-1.5 text-zinc-800 transition hover:border-[var(--w-gold-deep)]/50 hover:text-[var(--w-gold-deep)] dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-100 dark:hover:border-[var(--w-gold-soft-b)]/40"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="cennik" className="scroll-mt-header mt-16 space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Cennik (orientacyjny)</h2>
        <p className="max-w-3xl text-zinc-600 dark:text-zinc-400">
          Trzy progi wejścia — możemy je dopasować do liczby sekcji, integracji i poziomu personalizacji.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Start",
              price: "od 890 zł",
              items: ["Szablon + kolory z palety", "Harmonogram i kontakt", "Hosting w chmurze Weddinfo"],
            },
            {
              name: "Standard",
              price: "od 1 490 zł",
              items: [
                "Wszystko z Start",
                "RSVP z listą gości",
                "Sekcja dojazdu + mapa",
                "Jedna runda poprawek treści",
              ],
              highlight: true,
            },
            {
              name: "Premium",
              price: "od 2 290 zł",
              items: [
                "Wszystko ze Standard",
                "Priorytetowy kontakt",
                "Dedykowana subdomena / domena*",
                "Dwie rundy poprawek + konsultacja layoutu",
              ],
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-2xl border p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                "highlight" in p && p.highlight
                  ? "border-[var(--w-gold-deep)]/45 bg-gradient-to-b from-white to-[var(--w-pink-dust)]/20 dark:from-zinc-900 dark:to-zinc-900/80"
                  : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
              }`}
            >
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{p.name}</h3>
              <p className="mt-2 text-2xl font-semibold text-[var(--w-gold-deep)]">{p.price}</p>
              <ul className="mt-4 flex flex-1 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {p.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <Link
                href="/zloz-zapytanie"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-rose-800 px-4 text-sm font-semibold text-white transition hover:bg-rose-900"
              >
                Zapytaj o ten pakiet
              </Link>
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          *Konfiguracja domeny zależy od dostępności nazwy i rejestratora — ustalamy to przed umową.
        </p>
      </section>

      <section id="uslugi" className="scroll-mt-header mt-20 space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Rodzaje usług</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Wizytówka weselna",
              desc: "Publiczna strona dla gości: harmonogram, dojazd, nocleg, RSVP, galeria (link), kontakt.",
            },
            {
              title: "Konsultacja i dobór szablonu",
              desc: "Dobieramy typografię, tło i akcenty pod Wasz styl — bez przypadkowego „szarego boxa”.",
            },
            {
              title: "Integracja z Wedding Assistant",
              desc: "Możliwość spięcia z innymi narzędziami z ekosystemu — ustalane indywidualnie.",
            },
            {
              title: "Wsparcie po publikacji",
              desc: "Krótka instrukcja dla pary + ewentualne poprawki przed weselem (wg pakietu).",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-zinc-200 bg-white/90 p-5 transition hover:border-[var(--w-gold-deep)]/35 dark:border-zinc-800 dark:bg-zinc-950/80"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="co-dostajesz" className="scroll-mt-header mt-20 space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Co dostajesz po stronie technicznej</h2>
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-zinc-600 dark:text-zinc-400">
          <li>
            <strong className="text-zinc-800 dark:text-zinc-200">Miejsce w chmurze</strong> — hosting
            aplikacji i statycznych zasobów w ramach infrastruktury Weddinfo (bez konfiguracji własnego
            serwera po stronie pary).
          </li>
          <li>
            <strong className="text-zinc-800 dark:text-zinc-200">Adres pod wizytówkę</strong> — domyślnie
            subdomena w domenie Weddinfo; w pakietach wyższych możliwość podpięcia własnej domeny po
            stronie DNS u rejestratora.
          </li>
          <li>
            <strong className="text-zinc-800 dark:text-zinc-200">Szyfrowany ruch HTTPS</strong> oraz
            podstawowe zabezpieczenia aplikacyjne (m.in. limitowanie zgłoszeń formularza, proste zadanie
            antyspamowe).
          </li>
          <li>
            <strong className="text-zinc-800 dark:text-zinc-200">Panel statusu zapytania</strong> — numer
            referencyjny, podgląd postępu, wiadomości i załączniki zgodnie z wdrożonym zakresem.
          </li>
        </ul>
      </section>

      <section id="wspolpraca" className="scroll-mt-header mt-20 space-y-8">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Jak wygląda współpraca</h2>
        <p className="max-w-3xl text-zinc-600 dark:text-zinc-400">
          Każdy krok ma jasny efekt końcowy — nie zostawiamy Cię z „kiedyś to się zrobi”.
        </p>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[var(--w-gold-deep)]/35 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[var(--w-gold-deep)] to-[var(--w-gold-soft-b)] transition duration-500 group-hover:scale-x-100"
                aria-hidden
              />
              <div className="mb-3 flex size-9 items-center justify-center rounded-full border border-[var(--w-gold-deep)]/40 bg-[var(--w-cream-b)] text-sm font-bold text-[var(--w-gold-deep)] transition group-hover:scale-105 dark:bg-zinc-900">
                {i + 1}
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="sla" className="scroll-mt-header mt-20 space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">SLA — czas odpowiedzi</h2>
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <li>
            <strong>Pierwsza odpowiedź na zapytanie z formularza:</strong> do{" "}
            <strong>2 dni roboczych</strong> (pon.–pt., z wyłączeniem świąt).
          </li>
          <li>
            <strong>Kolejne wiadomości w wątku zapytania:</strong> zwykle do{" "}
            <strong>1 dnia roboczego</strong> — w sezonie weselnym może się wydłużyć; wtedy informujemy o
            kolejce.
          </li>
          <li>
            <strong>Pakiety Premium:</strong> priorytet w kolejności realizacji i krótsze okno na pierwszą
            odpowiedź — szczegóły w ofercie handlowej po briefie.
          </li>
        </ul>
        <p className="text-xs text-zinc-500">
          SLA dotyczy kontaktu operacyjnego, a nie samej publikacji strony — termin wdrożenia zależy od
          zakresu i Twojej dostępności na akceptacje.
        </p>
      </section>

      <section id="faq" className="scroll-mt-header mt-20 space-y-6 pb-8">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">FAQ</h2>
        <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
          {[
            {
              q: "Czy muszę mieć już zebrane wszystkie teksty?",
              a: "Nie — wystarczy brief. Treści możemy uzupełniać iteracyjnie; im wcześniej masz datę i lokalizację, tym spokojniejszy harmonogram prac.",
            },
            {
              q: "Czy goście muszą coś instalować?",
              a: "Nie. Wizytówka to zwykła strona w przeglądarce — jeden link z zaproszenia lub SMS-a.",
            },
            {
              q: "Jak wygląda RSVP?",
              a: "Gość wypełnia krótki formularz na stronie; odpowiedzi trafiają do panelu zapytania pary. Możemy włączyć lub wyłączyć RSVP wg briefu.",
            },
            {
              q: "Czy mogę mieć własną domenę?",
              a: "Tak w wyższych pakietach — wymaga konfiguracji DNS u Twojego rejestratora. Pomagamy instrukcją krok po kroku.",
            },
            {
              q: "Co jeśli po wesele chcę usunąć stronę?",
              a: "Możemy ustawić tryb archiwum lub wyłączyć publikację — ustalamy to przy kontrakcie / mailu końcowym.",
            },
          ].map((item) => (
            <details key={item.q} className="group p-5 transition-colors open:bg-zinc-50 dark:open:bg-zinc-900/60">
              <summary className="cursor-pointer list-none font-medium text-zinc-900 marker:content-none dark:text-zinc-50 [&::-webkit-details-marker]:hidden">
                <span className="inline-flex w-full items-center justify-between gap-2">
                  {item.q}
                  <span className="text-zinc-400 transition group-open:rotate-180">▾</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-12 text-center">
        <Link
          href="/zloz-zapytanie"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--w-gold-deep)] to-[var(--w-gold-soft-b)] px-8 text-base font-semibold text-white shadow-md hover:brightness-105"
        >
          Złóż zapytanie z briefem
        </Link>
      </p>
    </div>
  );
}
