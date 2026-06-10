# Uruchomienie Weddinfo — baza, maile, konta gości

Instrukcja krok po kroku dla hostingu **SeoHost** (MySQL + SMTP). Wartości wrażliwe trzymamy wyłącznie w `.env.local` (lokalnie) lub w panelu hostingu (produkcja) — **nie commitujemy**.

---

## 1. Baza MySQL (`srv91710_weddinfo`)

### W panelu SeoHost

1. Utwórz bazę **`srv91710_weddinfo`** (jeśli jeszcze nie istnieje).
2. Utwórz użytkownika MySQL z pełnymi prawami do tej bazy.
3. Zanotuj:
   - host (często `localhost` na shared hostingu),
   - port (`3306`),
   - nazwę bazy,
   - login i hasło.

### Zmienna środowiskowa

W `.env.local` (lokalnie) lub w panelu aplikacji (produkcja):

```env
# Produkcja (aplikacja na SeoHost):
DATABASE_URL="mysql://LOGIN:HASLO@localhost:3306/srv91710_weddinfo"

# Local dev (npm run dev z Twojego PC):
DATABASE_URL="mysql://LOGIN:HASLO@h63.seohost.pl:3306/srv91710_weddinfo"
```

- Zastąp `LOGIN`, `HASLO` danymi z panelu.
- Jeśli hasło zawiera znaki specjalne (`@`, `#`, `%` itd.), zakoduj je w URL (encodeURIComponent).

### Utworzenie tabel

```bash
npm run db:push
```

Alternatywnie w **phpMyAdmin** (import ręczny):

- **Pusta baza** → zaimportuj `drizzle/0000_inquiries_mysql.sql`
- **Masz już tabelę `inquiries`** → wklej SQL z `drizzle/0000_inquiries_remaining.sql`

Po sukcesie powinny powstać tabele: `inquiries`, `inquiry_attachments`, `inquiry_messages`.

**Aktualizacja (status anulowania):** w phpMyAdmin uruchom też:

```sql
-- plik: drizzle/0001_inquiry_cancelled_status.sql
ALTER TABLE `inquiries`
  MODIFY COLUMN `status` enum('new','in_progress','closed','cancelled_by_client') NOT NULL DEFAULT 'new';
```

**Aktualizacja (anty-spam / rate limit):** w phpMyAdmin uruchom:

```sql
-- plik: drizzle/0002_rate_limits.sql
CREATE TABLE IF NOT EXISTS `rate_limits` (
  `bucket` varchar(191) NOT NULL,
  `count` int NOT NULL DEFAULT 0,
  `window_started_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`bucket`)
);
```

Bez tej tabeli formularz i logowanie działają, ale limity prób nie są zapisywane.

### Lokalny dev — zdalny dostęp MySQL

`localhost` w `DATABASE_URL` **nie zadziała** z Twojego komputera — MySQL słucha na serwerze SeoHost.

1. W panelu SeoHost włącz **zdalny dostęp MySQL** i dodaj swój publiczny IP.
2. W `.env.local` ustaw host `h63.seohost.pl` (nie `localhost`).
3. Sprawdź: `node scripts/test-db-connection.mjs` → oczekiwane: `OK h63.seohost.pl`.

Opcjonalnie na localu:

```env
WEDDINFO_DEV_RETURN_PASSWORD="true"
```

— hasło gościa pojawi się na ekranie po wysłaniu formularza.

---

## 2. Wysyłka maili (SMTP)

### W panelu SeoHost / poczta

1. Utwórz skrzynkę np. `powiadomienia@twoja-domena.pl`.
2. Włącz SMTP dla tej skrzynki (port **465** + SSL lub **587** + STARTTLS).

### Zmienne w `.env.local`

```env
SMTP_HOST="mail.twoja-domena.pl"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="powiadomienia@twoja-domena.pl"
SMTP_PASS="haslo-do-skrzynki"
WEDDINFO_MAIL_FROM="Weddinfo <powiadomienia@twoja-domena.pl>"
WEDDINFO_CONTACT_NOTIFY_EMAIL="twoj@email.pl"
WEDDINFO_SITE_URL="https://weddinfo.pl"
```

| Zmienna | Opis |
|---------|------|
| `SMTP_*` | Połączenie z serwerem pocztowym |
| `WEDDINFO_MAIL_FROM` | Nadawca w mailach do klienta (opcjonalnie — domyślnie `Weddinfo <SMTP_USER>`) |
| `WEDDINFO_CONTACT_NOTIFY_EMAIL` | Twój adres — powiadomienia o nowych zgłoszeniach |
| `WEDDINFO_SITE_URL` | Linki w mailach (`/zapytanie/123456`) |

Szczegóły: [konfiguracja-mail.md](./konfiguracja-mail.md).

### Test maili

1. Uruchom aplikację: `npm run dev`.
2. Wyślij formularz na `/kontakt`.
3. Sprawdź:
   - mail **do klienta** — numer zgłoszenia, hasło, link do statusu,
   - mail **do admina** — powiadomienie z linkiem.

Jeśli klient nie dostanie maila, formularz zwróci błąd (rekord w bazie już istnieje — wtedy wyślij hasło ręcznie z phpMyAdmin lub ponów kontakt).

---

## 3. Automatyczne „konta” gościa (numer + hasło)

System **nie wymaga rejestracji**. Przy każdym wysłanym formularzu:

| Element | Jak powstaje | Gdzie trafia |
|---------|--------------|--------------|
| **Numer zgłoszenia** (`public_id`) | Losowy 6-cyfrowy ID (`generatePublicInquiryId`) | Baza + mail do klienta |
| **Hasło gościa** | Losowe 8 znaków (`generateGuestPassword`) | Hash w bazie (`guest_password_hash`) + **plain text tylko w mailu** |
| **Dostęp do statusu** | `/zapytanie/[numer]` + hasło z maila | Cookie sesji po poprawnym haśle |

### Dodatkowe zmienne

```env
WEDDINFO_COOKIE_SECRET="min-16-znakow-losowego-ciagu"
```

Używane do: captcha (HMAC) i cookie podglądu statusu zgłoszenia.

### Dev — podgląd hasła na ekranie

```env
WEDDINFO_DEV_RETURN_PASSWORD="true"
```

**Tylko lokalnie, nigdy na produkcji.** Po wysłaniu formularza hasło pojawi się na stronie (pomija mail).

### Przepływ dla klienta

1. Wypełnia formularz na `/kontakt`.
2. Dostaje e-mail: *„Numer zgłoszenia: #123456, hasło: Ab3xY9zQ”*.
3. Wchodzi na `/zapytanie/123456`, wpisuje hasło.
4. Widzi status, załączniki, korespondencję — może dodać komentarz lub anulować zgłoszenie.
5. Po komentarzu / anulowaniu — e-mail do klienta i admina z linkiem do statusu.

---

## 4. Panel admina

### Konfiguracja

```env
WEDDINFO_ADMIN_PASSWORD_HASH_B64=JDJiJDEyJ...
```

> **Ważne:** Nie używaj surowego hasha `$2b$12$...` w `.env` — Next.js obcina go przez znaki `$`.

Hash wygenerujesz lokalnie:

```bash
npm run admin:hash-password -- "twoje-haslo-admina"
```

Skopiuj linię `WEDDINFO_ADMIN_PASSWORD_HASH_B64=...` do `.env.local`.

### Dostęp

- URL: `/admin` (logowanie hasłem)
- Skrót: 6 szybkich kliknięć w link **Realizacje** w menu
- Lista zgłoszeń: `/admin/zapytania`
- Szczegóły: `/admin/zapytania/[numer]`

### Możliwości admina

- Przegląd wszystkich zgłoszeń
- Podgląd briefu, załączników, korespondencji
- Odpowiedź do klienta (zapis w `inquiry_messages` + mail)
- Zmiana statusu (`new`, `in_progress`, `closed`, `cancelled_by_client`) + mail do klienta

---

## 5. Cloudflare Turnstile (opcjonalnie, zalecane na produkcji)

Gdy ustawisz **oba** klucze, formularz `/kontakt` używa Turnstile zamiast captchy matematycznej.

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Turnstile** → **Add widget**.
2. W **Domains** dodaj domenę produkcyjną (np. `weddinfo.pl`) oraz `localhost` (dev).
3. Tryb: **Managed** (najlepszy UX).
4. Skopiuj klucze do `.env.local` / panelu hostingu:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x4AAAAAAA..."
TURNSTILE_SECRET_KEY="0x4AAAAAAA..."
```

| Zmienna | Gdzie |
|---------|--------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Frontend (może być publiczny) |
| `TURNSTILE_SECRET_KEY` | Tylko serwer — **nigdy** w repo |

Po zmianie env zrestartuj aplikację (`npm run dev` lub redeploy).

Bez tych zmiennych działa dotychczasowa captcha matematyczna + honeypot + rate limiting.

---

## 6. Upload plików z formularza

Domyślnie pliki trafiają do `storage/inquiries/{numer}/` w katalogu projektu.

Na produkcji ustaw trwały katalog **poza** folderem deployu:

```env
WEDDINFO_UPLOAD_DIR="/home/uzytkownik/weddinfo-uploads/inquiries"
```

Upewnij się, że proces Node ma prawo zapisu.

---

## 7. Checklist przed produkcją

- [ ] `DATABASE_URL` — połączenie działa
- [ ] Migracja `0001_inquiry_cancelled_status.sql` wykonana
- [ ] Migracja `0002_rate_limits.sql` wykonana (anty-spam / brute-force)
- [ ] `WEDDINFO_COOKIE_SECRET` — ustawiony (min. 16 znaków)
- [ ] `WEDDINFO_ADMIN_PASSWORD_HASH_B64` — hash hasła admina
- [ ] `SMTP_*` — test wysyłki z formularza
- [ ] `WEDDINFO_CONTACT_NOTIFY_EMAIL` — Twój adres
- [ ] `WEDDINFO_SITE_URL` — prawidłowa domena HTTPS
- [ ] `WEDDINFO_UPLOAD_DIR` — katalog zapisu na serwerze
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` — opcjonalnie, zalecane
- [ ] `WEDDINFO_DEV_RETURN_PASSWORD` — **wyłączone** na produkcji

---

## 8. Gdzie to jest w kodzie

| Funkcja | Plik |
|---------|------|
| Formularz | `src/app/kontakt/unified-inquiry-form.tsx` |
| Status gościa (komentarz, anuluj) | `src/app/zapytanie/[publicId]/` |
| Panel admina | `src/app/admin/` |
| Załączniki (API) | `src/app/api/zapytanie/[publicId]/zalacznik/[attachmentId]/` |
| Maile zdarzeń | `src/lib/mail.ts`, `src/lib/inquiry-events.ts` |
| Schema bazy | `src/db/schema.ts`, `src/data/inquiries.ts` |
