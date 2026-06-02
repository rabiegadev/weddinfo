# Konfiguracja poczty — Weddinfo

Stan na: czerwiec 2026. Plik opisuje **wyłącznie** ustawienia wysyłki e-mail (bez haseł i sekretów).
Wartości produkcyjne trzymamy w `.env.local` (nie commitujemy).

## Zmienne środowiskowe (SMTP)

| Zmienna | Wymagana | Opis | Przykład / domyślne |
|---------|----------|------|---------------------|
| `SMTP_HOST` | tak | Serwer SMTP (np. SeoHost) | `mail.twoja-domena.pl` |
| `SMTP_PORT` | tak | Port — `465` (SSL) lub `587` (STARTTLS) | `465` |
| `SMTP_SECURE` | zalecana | `true` dla portu 465, `false` dla 587 | `true` |
| `SMTP_USER` | tak | Login SMTP | `powiadomienia@twoja-domena.pl` |
| `SMTP_PASS` | tak | Hasło do konta SMTP | *(w .env.local)* |
| `WEDDINFO_MAIL_FROM` | nie | Nagłówek nadawcy | `Weddinfo <powiadomienia@twoja-domena.pl>` — jeśli puste: `Weddinfo <SMTP_USER>` |

## Powiadomienia o wiadomościach z formularza

| Zmienna | Wymagana | Opis |
|---------|----------|------|
| `WEDDINFO_CONTACT_NOTIFY_EMAIL` | zalecana | Adres, na który trafiają zgłoszenia z `/kontakt`. Jeśli puste — używany jest `SMTP_USER`. |

## Linki w treści maili

| Zmienna | Wymagana | Opis |
|---------|----------|------|
| `WEDDINFO_SITE_URL` | zalecana | Kanoniczny URL serwisu (linki w mailach) |
| `NEXT_PUBLIC_SITE_URL` | nie | Zapasowy publiczny URL |
| `VERCEL_URL` | auto | Używany na Vercel, gdy brak powyższych |

Kolejność w kodzie (`getPublicSiteBaseUrl`): `WEDDINFO_SITE_URL` → `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → `https://weddinfo.pl`.

## Gdzie to jest w kodzie

- `src/lib/mail.ts` — transport nodemailer, wysyłka potwierdzeń i powiadomień z formularza kontaktowego
- `src/app/kontakt/actions.ts` — server action `submitContactForm`
- `.env.example` — szablon zmiennych (bez wartości wrażliwych)

## Usunięte (poprzedni stack)

Poniższe **nie są już używane** po migracji z Neon Postgres + formularzy zapytania:

- `DATABASE_URL` (Neon / Drizzle)
- `WEDDINFO_COOKIE_SECRET`, `WEDDINFO_ADMIN_PASSWORD_HASH` (panel admina, captcha, sesje gościa)
- `WEDDINFO_ADMIN_NOTIFY_EMAIL` (powiadomienia o zapytaniach w starym systemie)
- `WEDDINFO_DEV_RETURN_PASSWORD`
- `FILES_UPLOAD_ENDPOINT`, `FILES_UPLOAD_TOKEN`, `FILES_PUBLIC_BASE_URL` (upload zdjęć z briefu)

## Planowana baza MySQL (SeoHost)

Docelowa baza: **`srv91710_weddinfo`** na SeoHost.pl.

Po podłączeniu MySQL formularz `/kontakt` będzie zapisywał zgłoszenia w bazie (numer referencyjny, status itd.).
Na razie wiadomości są obsługiwane **wyłącznie przez e-mail SMTP**.

Planowane zmienne (do uzupełnienia po utworzeniu użytkownika DB):

```
MYSQL_HOST=
MYSQL_PORT=3306
MYSQL_DATABASE=srv91710_weddinfo
MYSQL_USER=
MYSQL_PASSWORD=
```
