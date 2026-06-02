# Model bazy danych — Weddinfo (MySQL)

Baza docelowa: **`srv91710_weddinfo`** (SeoHost).

## Tabele

### `inquiries`

Główna tabela zgłoszeń z formularzy `/kontakt`.

| Kolumna | Typ | Opis |
|---------|-----|------|
| `id` | BIGINT PK | Wewnętrzny identyfikator |
| `public_id` | VARCHAR(12) UNIQUE | Numer dla klienta (np. `482917`) |
| `guest_password_hash` | VARCHAR(255) | Hash hasła do podglądu statusu |
| `inquiry_type` | ENUM | `individual`, `premium`, `basic`, `contact` |
| `status` | ENUM | `new`, `in_progress`, `closed` |
| `client_email` | VARCHAR(255) | E-mail kontaktowy |
| `client_phone` | VARCHAR(30) NULL | Telefon |
| `contact_full_name` | VARCHAR(120) NULL | Formularz kontaktowy |
| `contact_message` | TEXT NULL | Treść zapytania |
| `bride_name` … `guest_info` | TEXT/VARCHAR | Dane wesela (pakiety) |
| `color_preferences` … `correction_requests` | TEXT NULL | Preferencje wizualne / uwagi |
| `template_name` | VARCHAR(120) NULL | Szablon (Premium / Basic) |
| `wants_qr_code`, `wants_rsvp`, … | BOOLEAN NULL | Opcje funkcji |
| `*_notes` | TEXT NULL | Uwagi przy opcjach tak/nie |
| `created_at`, `updated_at` | DATETIME | Audyt |

### `inquiry_attachments`

Pliki do zgłoszenia (max 2 na formularz w aplikacji).

| Kolumna | Typ | Opis |
|---------|-----|------|
| `inquiry_id` | FK → inquiries | Powiązanie |
| `attachment_kind` | ENUM | `inspiration`, `couple_photo`, `contact_file` |
| `stored_name` | VARCHAR(255) | Nazwa na dysku |
| `original_name` | VARCHAR(255) | Oryginalna nazwa pliku |
| `mime_type` | VARCHAR(100) | MIME |
| `byte_size` | INT UNSIGNED | Rozmiar w bajtach |

### `inquiry_messages`

Korespondencja gość ↔ obsługa (przygotowane pod przyszły panel statusu).

| Kolumna | Typ | Opis |
|---------|-----|------|
| `inquiry_id` | FK | Zgłoszenie |
| `author_role` | ENUM | `guest`, `staff` |
| `body` | TEXT | Treść wiadomości |

## Migracje

```bash
# Po ustawieniu DATABASE_URL w .env.local
npm run db:push
```

Plik SQL: `drizzle/0000_inquiries_mysql.sql` (generowany przez Drizzle Kit).

## Typy formularzy

| Zakładka | `inquiry_type` | Zakres pól |
|----------|----------------|------------|
| Individual | `individual` | Pełny brief + sekcja wizualna (QR, RSVP, hasło, galeria, zdjęcia) |
| Premium | `premium` | Brief + szablon, RSVP, QR, zdjęcia pary |
| Basic | `basic` | Brief + szablon, bez RSVP / QR / galerii |
| Kontakt | `contact` | Imię, e-mail, telefon, wiadomość, max 2 załączniki |
