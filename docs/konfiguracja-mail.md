# Konfiguracja poczty — Weddinfo

Stan na: czerwiec 2026. Opisuje wysyłkę e-mail po wysłaniu formularza `/kontakt`.

Pełna instrukcja uruchomienia (baza + maile + konta gości): **[konfiguracja-start.md](./konfiguracja-start.md)**.

## Zmienne środowiskowe (SMTP)

| Zmienna | Wymagana | Opis | Przykład / domyślne |
|---------|----------|------|---------------------|
| `SMTP_HOST` | tak | Serwer SMTP (np. SeoHost) | `mail.twoja-domena.pl` |
| `SMTP_PORT` | tak | Port — `465` (SSL) lub `587` (STARTTLS) | `465` |
| `SMTP_SECURE` | zalecana | `true` dla portu 465, `false` dla 587 | `true` |
| `SMTP_USER` | tak | Login SMTP | `powiadomienia@twoja-domena.pl` |
| `SMTP_PASS` | tak | Hasło do konta SMTP | *(w .env.local)* |
| `WEDDINFO_MAIL_FROM` | nie | Nagłówek nadawcy | `Weddinfo <powiadomienia@twoja-domena.pl>` — jeśli puste: `Weddinfo <SMTP_USER>` |

## Powiadomienia o zgłoszeniach

| Zmienna | Wymagana | Opis |
|---------|----------|------|
| `WEDDINFO_CONTACT_NOTIFY_EMAIL` | zalecana | Adres, na który trafiają zgłoszenia z `/kontakt`. Jeśli puste — używany jest `SMTP_USER`. |

## Linki w treści maili

| Zmienna | Wymagana | Opis |
|---------|----------|------|
| `WEDDINFO_SITE_URL` | zalecana | Kanoniczny URL serwisu (linki w mailach) |
| `NEXT_PUBLIC_SITE_URL` | nie | Zapasowy publiczny URL |
| `VERCEL_URL` | auto | Używany na Vercel, gdy brak powyższych |

Kolejność w kodzie: `WEDDINFO_SITE_URL` → `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → `https://weddinfo.pl`.

## Co wysyła system

Po poprawnym zapisie zgłoszenia w MySQL:

1. **Mail do klienta** — numer zgłoszenia (6 cyfr), hasło gościa, link `/zapytanie/[numer]`, przewidywany czas odpowiedzi.
2. **Mail do admina** — powiadomienie z typem formularza i linkiem do widoku statusu.

Błąd maila do klienta = błąd dla użytkownika (rekord w bazie już istnieje).  
Błąd maila admina = tylko log serwera, klient dostaje sukces.

## Gdzie to jest w kodzie

- `src/lib/mail.ts` — transport nodemailer
- `src/app/kontakt/actions.ts` — `submitInquiryForm`
- `.env.example` — szablon zmiennych

## Powiązane zmienne (nie SMTP)

| Zmienna | Opis |
|---------|------|
| `DATABASE_URL` | MySQL — zapis zgłoszeń |
| `WEDDINFO_COOKIE_SECRET` | Captcha + sesja statusu |
| `WEDDINFO_UPLOAD_DIR` | Katalog załączników |
| `WEDDINFO_DEV_RETURN_PASSWORD` | Dev: hasło na ekranie zamiast tylko w mailu |

## Usunięte (stary stack)

Nieużywane: Neon Postgres, `FILES_UPLOAD_*`, panel `/admin`, `WEDDINFO_ADMIN_PASSWORD_HASH`.
