# Audyt Weddinfo (16.04.2026)

## 1) Założenia produktu (na podstawie kodu i testów)

- Strona usługowa `Weddinfo` promuje tworzenie wizytówek weselnych.
- Główne ścieżki użytkownika:
  - landing (`/`) z ofertą, realizacjami, opiniami i CTA,
  - formularz zapytania (`/zloz-zapytanie`) w 2 trybach: wizytówka weselna i kontakt,
  - panel admin (`/admin/*`) zabezpieczony hasłem,
  - strefa klienta (`/zapytanie/[unid]`) zabezpieczona hasłem z e-maila,
  - strona odpowiedzi przez token (`/zapytanie/[unid]/odpowiedz?t=...`).
- Kluczowa obietnica biznesowa: po wysłaniu formularza klient dostaje numer i dostęp do statusu zapytania.
- Aplikacja jest responsywna (desktop/mobile), z naciskiem na formularz i wygodę mobilną.

## 2) Weryfikacja problemu duplikatów (status: POTWIERDZONY)

### Co sprawdziłem

- Wysłałem formularz kontaktowy 2 razy pod rząd z tym samym adresem `kamrtester@gmail.com`.
- Obie odpowiedzi zwróciły ten sam numer referencyjny: `#xkwnbep9vy`.

### Przyczyna techniczna

- W `src/app/zloz-zapytanie/actions.ts` działa guard anty-duplikacyjny na 30 s:
  - klucz: `clientEmail + inquiryType`,
  - jeśli znajdzie rekord, funkcja zwraca istniejący `publicId` i `mailSent: true`.

### Ryzyko

- Użytkownik może myśleć, że wysłał nowe zgłoszenie, a faktycznie nic nowego nie zapisuje się.
- W przypadku poprawki treści "od razu po wysłaniu" system może zwrócić stare zgłoszenie.
- `mailSent: true` dla duplikatu nie oznacza realnej ponownej wysyłki e-maila.

### Rekomendacja

- Zmienić strategię anty-duplikacji:
  - albo całkowicie usunąć hard dedupe po e-mailu,
  - albo dedupe po `idempotencyKey` generowanym po stronie klienta (jeden klik = jedno zgłoszenie),
  - albo dedupe po pełnym fingerprint (treść + email + timestamp okna 3-5 s).
- Gdy zwracasz istniejący rekord, zwróć jawny status np. `reused: true` i czytelny komunikat UI.
- Nie ustawiaj automatycznie `mailSent: true`, jeśli realnie nie wysłano e-maila.

## 3) Test funkcjonalny (manualny) - co działa, co nie

### Przetestowane i działające

- Landing (`/`) ładuje się poprawnie.
- Formularz zapytania działa i zapisuje rekordy.
- Walidacje wymaganych pól działają:
  - tryb "wizytówka": wymagane `p1f`, `p1l`, `p2f`, `p2l`, `locationName`, `clientEmail`,
  - tryb "kontakt": wymagane `contactFullName`, `clientEmail`, `contactMessage`.
- Logowanie klienta (`/zapytanie/[unid]`) dla błędnego hasła zwraca poprawny komunikat "Nieprawidłowe hasło."
- Logowanie admin (`/admin/login`) dla błędnego hasła zwraca poprawny komunikat.
- Brak błędów w konsoli podczas testowanego przeglądu.

### Ograniczenia testu

- Nie mogłem wykonać pełnego pozytywnego logowania klienta (brak jawnego hasła testowego z e-maila w środowisku testowym).
- Nie testowałem przepływu tokenu odpowiedzi `/odpowiedz?t=...` bez ważnego tokenu.

## 4) Bezpieczeństwo - priorytety

## Krytyczne/Wysokie

- Brak ograniczania prób logowania (admin i klient) - ryzyko brute force.
- Brak anty-spam ochrony formularza (`captcha`, honeypot, rate limit per IP/email).
- Dedupe po e-mailu i typie może maskować faktyczne działanie systemu (opisane wyżej).

## Średnie

- Komunikat o polityce prywatności brzmi tymczasowo ("Szczegóły ... dodamy") - ryzyko formalno-prawne.
- Brak jawnej strony polityki prywatności i zasad przetwarzania danych w stałej nawigacji.
- Warto dodać audyt logów bezpieczeństwa (np. liczba nieudanych logowań, z jakich IP).

## Rekomendacje bezpieczeństwa

- Dodać rate limiting:
  - `POST /zloz-zapytanie`,
  - akcje logowania admin,
  - akcje odblokowania zapytania klienta.
- Dodać captcha/honeypot dla publicznych formularzy.
- Dodać lockout lub progressive delay po kilku błędnych hasłach.
- Dodać monitoring i alerty (np. gwałtowny wzrost nieudanych logowań).

## 5) Audyt UX/UI i treści

### Co jest dobre

- Spójna estetyka i dobre sekcje sprzedażowe.
- Formularze są czytelne i dobrze podzielone.
- Struktura mobile jest poprawna, pola mają odpowiednią wielkość dotykową.

### Co warto poprawić

- Sekcja realizacji ma dużo kart DEMO z bardzo podobnym opisem ("Spersonalizowane kolory..."), co obniża wiarygodność i różnicowanie oferty.
- W opiniach są 3 cytaty DEMO (teraz poprawnie oznaczone nakładką), ale warto doprecyzować "Opinie przykładowe / symulowane" także tekstowo pod nagłówkiem.
- Część komunikatów jest powtarzana między sekcjami i stopką; warto skrócić copy, by CTA były mocniejsze.
- Przy dużej liczbie sekcji tekstowych warto dodać "sticky CTA" na mobile (np. "Złóż zapytanie").

## 6) Wymagane / niewymagane pola - ocena

- Obecny podział required vs optional jest logiczny.
- Brakuje jasnych podpowiedzi "co jest opcjonalne" przy niektórych grupach pól (można dodać etykiety "opcjonalne" przy sekcjach).
- Warto dodać walidację formatu numeru telefonu (obecnie bardziej swobodna).
- Warto dodać walidację niektórych URL-i map (lub przynajmniej pomocniczy hint).

## 7) Co powinno dojść na stronie usługowej (oferta)

- Cennik (minimum 3 pakiety): `Start`, `Standard`, `Premium`.
- Zakres usługi i co zawiera każdy pakiet (np. RSVP, mapa, galeria, własna domena, wsparcie).
- FAQ (czas realizacji, poprawki, domena, RODO, zdjęcia, integracje).
- Proces współpracy krok po kroku (brief -> projekt -> akceptacja -> publikacja).
- Jasne SLA/czas odpowiedzi.
- Sekcja "co dostajesz po wdrożeniu" + "co jest poza zakresem".
- Mocniejsze CTA konwersyjne: "Umów konsultację", "Zobacz demo live", "Sprawdź cennik".

## 8) Co z założeń jeszcze nie jest domknięte

- Mechanizm anty-duplikacji wymaga poprawy, bo wpływa na kluczowy proces sprzedażowy.
- Brakuje pełnej warstwy formalnej (polityka prywatności / RODO jako gotowe strony).
- Brakuje elementów oferty handlowej (pakiety/cennik/FAQ), które zwiększają konwersję i klarowność.
- Potrzebny pełny test pozytywnego logowania klienta w środowisku QA z kontrolowanym hasłem.

## 9) Priorytety wdrożeniowe (kolejność)

1. Naprawa dedupe i komunikatu sukcesu (`mailSent` + jasny status duplikatu).
2. Rate limiting + antyspam + ograniczanie prób logowania.
3. Uzupełnienie stron prawnych i linków w stopce.
4. Uzupełnienie oferty: pakiety/cennik + FAQ + proces współpracy.
5. Redukcja powtórzeń treści i dopracowanie sekcji DEMO/opinii.

## 10) Dodatkowe uwagi testowe

- W poprzednim teście zostało wysłanych wiele testowych zapytań; warto je oznaczyć lub wyczyścić w bazie testowej.
- Do cyklicznego QA warto dodać checklistę regresji (formularz, klient, admin, RSVP, upload, tokeny).
