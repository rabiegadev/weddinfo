import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Polityka prywatności i RODO",
  description:
    "Informacje o przetwarzaniu danych osobowych w serwisie Weddinfo — zapytania, wizytówki weselne i panel administracyjny.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="page-below-header mx-auto max-w-3xl px-4 pb-[calc(3rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:pb-14">
      <p className="mb-8 mt-1 text-sm">
        <Link href="/" className="text-rose-800 underline-offset-2 hover:underline dark:text-rose-200">
          ← Strona główna
        </Link>
      </p>
      <article className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-semibold prose-p:text-[15px] prose-p:leading-relaxed">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          Polityka prywatności i przetwarzanie danych (RODO)
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Ostatnia aktualizacja: 17 kwietnia 2026 r.
        </p>

        <h2>1. Administrator danych</h2>
        <p>
          Administratorem danych osobowych przetwarzanych w ramach serwisu internetowego Weddinfo jest
          podmiot wskazany w stopce strony lub w treści umowy / briefu (w zależności od tego, z kim
          zawierasz współpracę). Jeśli potrzebujesz danych rejestrowych administratora, skontaktuj się
          przez formularz na stronie lub bezpośrednio z operatorem projektu.
        </p>

        <h2>2. Cele i podstawy przetwarzania</h2>
        <ul>
          <li>
            <strong>Złożenie zapytania (formularz)</strong> — obsługa zapytania, przygotowanie oferty,
            kontakt zwrotny. Podstawa: art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy) oraz
            art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes — obsługa korespondencji).
          </li>
          <li>
            <strong>Podgląd zapytania przez klienta (hasło / sesja)</strong> — udostępnienie statusu
            realizacji. Podstawa: art. 6 ust. 1 lit. b lub f RODO, w zależności od charakteru umowy.
          </li>
          <li>
            <strong>Panel administracyjny</strong> — prowadzenie sprawy i archiwum techniczne. Podstawa:
            art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes — prowadzenie działalności i
            bezpieczeństwo IT).
          </li>
          <li>
            <strong>RSVP i wiadomości gości</strong> — obsługa odpowiedzi przekazanych przez gości w
            ramach wdrożonej wizytówki. Podstawa: art. 6 ust. 1 lit. b RODO (realizacja umowy z Parą
            Młodą).
          </li>
        </ul>

        <h2>3. Okres przechowywania</h2>
        <p>
          Dane z formularza i treść korespondencji przechowujemy przez czas potrzebny do realizacji
          usługi i rozliczenia, a następnie przez okres wymagany przepisami prawa lub uzasadniony dla
          dochodzenia roszczeń. Dokładny okres może wynikać z umowy lub polityki retencji administratora
          hostingu / bazy danych.
        </p>

        <h2>4. Odbiorcy danych</h2>
        <p>
          Dane mogą być powierzone podmiotom przetwarzającym w imieniu administratora (hosting,
          dostawca bazy danych, poczta e-mail, dostawca plików do uploadu zdjęć), wyłącznie w zakresie
          niezbędnym do świadczenia usługi.
        </p>

        <h2>5. Prawa osób, których dane dotyczą</h2>
        <p>Masz m.in. prawo do:</p>
        <ul>
          <li>dostępu do danych,</li>
          <li>sprostowania,</li>
          <li>usunięcia lub ograniczenia przetwarzania,</li>
          <li>wniesienia sprzeciwu wobec przetwarzania w uzasadnionych przypadkach,</li>
          <li>przenoszenia danych (w zakresie przewidzianym prawem),</li>
          <li>wniesienia skargi do Prezesa UODO.</li>
        </ul>

        <h2>6. Pliki cookies i podobne technologie</h2>
        <p>
          Serwis może wykorzystywać cookies techniczne niezbędne do działania strony (np. sesja
          podglądu zapytania, sesja panelu administracyjnego). Możesz zarządzać cookies w ustawieniach
          przeglądarki — pamiętaj, że wyłączenie cookies technicznych może utrudnić korzystanie z
          niektórych funkcji.
        </p>

        <h2>7. Zautomatyzowane podejmowanie decyzji</h2>
        <p>
          Nie podejmujemy wobec Ciebie decyzji wyłącznie zautomatyzowanych, które wywoływałyby wobec
          Ciebie skutki prawne lub w podobny sposób istotnie na Ciebie wpływały, w rozumieniu art. 22
          RODO.
        </p>

        <h2>8. Kontakt w sprawach ochrony danych</h2>
        <p>
          W sprawach związanych z ochroną danych skontaktuj się przez{" "}
          <Link href="/zloz-zapytanie" className="text-rose-800 underline-offset-2 hover:underline">
            formularz kontaktowy
          </Link>{" "}
          lub dane podane w stopce strony.
        </p>
      </article>
    </div>
  );
}
