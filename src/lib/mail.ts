import nodemailer from "nodemailer";

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
 * Wysyła potwierdzenie przez SMTP (np. konto e-mail w SeoHost).
 * Wymaga: SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS.
 */
export async function sendInquiryConfirmationEmail(
  p: InquiryMailParams,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpPortRaw = process.env.SMTP_PORT?.trim();
  const smtpSecureRaw = process.env.SMTP_SECURE?.trim().toLowerCase();
  const smtpPort = smtpPortRaw ? Number(smtpPortRaw) : 587;
  const smtpSecure = smtpSecureRaw ? smtpSecureRaw === "true" : smtpPort === 465;
  if (!smtpHost || !smtpUser || !smtpPass || Number.isNaN(smtpPort)) {
    return { ok: false, error: "Brak konfiguracji SMTP (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS)." };
  }

  const from =
    process.env.WEDDINFO_MAIL_FROM?.trim() ?? `Weddinfo <${smtpUser}>`;

  const subject = `Weddinfo — potwierdzenie zapytania #${p.publicId}`;
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    await transporter.sendMail({
      from,
      to: p.to,
      subject,
      html: buildInquiryEmailHtml(p),
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "SMTP send failed";
    console.error("[mail] SMTP error", errMsg);
    return { ok: false, error: errMsg };
  }

  return { ok: true };
}
