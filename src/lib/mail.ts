function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getPublicSiteBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  return "http://localhost:3000";
}

type InquiryMailParams = {
  to: string;
  publicId: string;
  guestPassword: string;
  coupleLabel: string;
  inquiryPath: string;
};

function buildInquiryEmailHtml(p: InquiryMailParams): string {
  const base = getPublicSiteBaseUrl();
  const link = `${base}${p.inquiryPath}`;
  const safe = {
    couple: escapeHtml(p.coupleLabel),
    id: escapeHtml(p.publicId),
    pass: escapeHtml(p.guestPassword),
    link: escapeHtml(link),
  };
  return `
<!DOCTYPE html>
<html lang="pl">
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #18181b;">
  <p>Dzień dobry,</p>
  <p>Dziękujemy za złożenie zapytania w <strong>Weddinfo</strong> (${safe.couple}).</p>
  <p><strong>Numer referencyjny:</strong> <code style="background:#f4f4f5;padding:2px 6px;border-radius:4px;">#${safe.id}</code></p>
  <p><strong>Hasło do podglądu zapytania:</strong> <code style="background:#fff1f2;padding:2px 8px;border-radius:4px;font-size:1.05em;">${safe.pass}</code></p>
  <p><a href="${safe.link}" style="color:#9f1239;">Otwórz stronę zapytania</a><br/>
  <span style="font-size:0.85em;color:#71717a;">${safe.link}</span></p>
  <p style="font-size:0.9em;color:#71717a;">Hasło jest potrzebne przy pierwszym wejściu na stronę zapytania.</p>
</body>
</html>`.trim();
}

/**
 * Wysyła potwierdzenie przez <a href="https://resend.com">Resend</a> (REST, bez dodatkowej paczki).
 * Wymaga `RESEND_API_KEY`. Nadawcę ustaw w `WEDDINFO_MAIL_FROM` (zweryfikowana domena w Resend).
 */
export async function sendInquiryConfirmationEmail(
  p: InquiryMailParams,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "Brak RESEND_API_KEY" };
  }

  const from =
    process.env.WEDDINFO_MAIL_FROM?.trim() ??
    "Weddinfo <onboarding@resend.dev>";

  const subject = `Weddinfo — potwierdzenie zapytania #${p.publicId}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [p.to],
      subject,
      html: buildInquiryEmailHtml(p),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[mail] Resend error", res.status, text);
    return { ok: false, error: text || `HTTP ${res.status}` };
  }

  return { ok: true };
}
