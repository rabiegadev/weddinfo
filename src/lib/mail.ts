import nodemailer from "nodemailer";
import type { InquiryStatus, InquiryType } from "@/db/schema";
import { getInquiryTabLabel, RESPONSE_TIME_LABEL } from "@/config/inquiry-tabs";
import { inquiryStatusLabels } from "@/lib/inquiry-status";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getPublicSiteBaseUrl(): string {
  const canonical = process.env.WEDDINFO_SITE_URL?.trim().replace(/\/$/, "");
  if (canonical) return canonical;
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  return "https://weddinfo.pl";
}

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

function readSmtpConfig(): { ok: true; config: SmtpConfig } | { ok: false; error: string } {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const portRaw = process.env.SMTP_PORT?.trim();
  const secureRaw = process.env.SMTP_SECURE?.trim().toLowerCase();
  const port = portRaw ? Number(portRaw) : 587;
  const secure = secureRaw ? secureRaw === "true" : port === 465;

  if (!host || !user || !pass || Number.isNaN(port)) {
    return { ok: false, error: "Brak konfiguracji SMTP." };
  }

  const from = process.env.WEDDINFO_MAIL_FROM?.trim() ?? `Weddinfo <${user}>`;
  return { ok: true, config: { host, port, secure, user, pass, from } };
}

async function sendHtmlMail(p: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const smtp = readSmtpConfig();
  if (!smtp.ok) return smtp;

  const transporter = nodemailer.createTransport({
    host: smtp.config.host,
    port: smtp.config.port,
    secure: smtp.config.secure,
    auth: { user: smtp.config.user, pass: smtp.config.pass },
  });

  try {
    await transporter.sendMail({ from: smtp.config.from, to: p.to, subject: p.subject, html: p.html });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "SMTP send failed";
    console.error("[mail]", errMsg);
    return { ok: false, error: errMsg };
  }
  return { ok: true };
}

export function getAdminNotifyEmail(): string | null {
  return (
    process.env.WEDDINFO_CONTACT_NOTIFY_EMAIL?.trim() ||
    process.env.WEDDINFO_ADMIN_NOTIFY_EMAIL?.trim() ||
    process.env.SMTP_USER?.trim() ||
    null
  );
}

export type InquiryMailPayload = {
  publicId: string;
  guestPassword: string;
  inquiryType: InquiryType;
  clientEmail: string;
  displayName: string;
};

function statusUrl(publicId: string): string {
  return `${getPublicSiteBaseUrl()}/zapytanie/${encodeURIComponent(publicId)}`;
}

function adminUrl(publicId: string): string {
  return `${getPublicSiteBaseUrl()}/admin/zapytania/${encodeURIComponent(publicId)}`;
}

export type InquiryEventType =
  | "guest_comment"
  | "guest_cancelled"
  | "staff_reply"
  | "status_changed";

export type InquiryEventMailPayload = {
  publicId: string;
  inquiryType: InquiryType;
  clientEmail: string;
  displayName: string;
  event: InquiryEventType;
  messagePreview?: string;
  newStatus?: InquiryStatus;
};

function eventSubject(p: InquiryEventMailPayload, forAdmin: boolean): string {
  const id = `#${p.publicId}`;
  switch (p.event) {
    case "guest_comment":
      return forAdmin
        ? `Weddinfo admin — nowy komentarz klienta ${id}`
        : `Weddinfo — dodano komentarz do zgłoszenia ${id}`;
    case "guest_cancelled":
      return forAdmin
        ? `Weddinfo admin — klient anulował zgłoszenie ${id}`
        : `Weddinfo — anulowano zgłoszenie ${id}`;
    case "staff_reply":
      return `Weddinfo — odpowiedź do zgłoszenia ${id}`;
    case "status_changed":
      return `Weddinfo — zmiana statusu zgłoszenia ${id}`;
    default:
      return `Weddinfo — aktualizacja zgłoszenia ${id}`;
  }
}

function eventIntro(p: InquiryEventMailPayload, forAdmin: boolean): string {
  const safeName = escapeHtml(p.displayName);
  const safeId = escapeHtml(p.publicId);
  switch (p.event) {
    case "guest_comment":
      return forAdmin
        ? `<p>Klient <strong>${safeName}</strong> dodał komentarz do zgłoszenia <strong>#${safeId}</strong>.</p>`
        : `<p>Dodałeś komentarz do zgłoszenia <strong>#${safeId}</strong>. Poniżej potwierdzenie.</p>`;
    case "guest_cancelled":
      return forAdmin
        ? `<p>Klient <strong>${safeName}</strong> anulował zgłoszenie <strong>#${safeId}</strong>.</p>`
        : `<p>Twoje zgłoszenie <strong>#${safeId}</strong> zostało oznaczone jako anulowane.</p>`;
    case "staff_reply":
      return `<p>Otrzymałeś odpowiedź od zespołu Weddinfo w sprawie zgłoszenia <strong>#${safeId}</strong>.</p>`;
    case "status_changed":
      return `<p>Status zgłoszenia <strong>#${safeId}</strong> został zaktualizowany.</p>`;
    default:
      return `<p>Aktualizacja zgłoszenia <strong>#${safeId}</strong>.</p>`;
  }
}

function buildEventHtml(p: InquiryEventMailPayload, forAdmin: boolean): string {
  const link = forAdmin ? adminUrl(p.publicId) : statusUrl(p.publicId);
  const linkLabel = forAdmin ? "Otwórz w panelu admina" : "Sprawdź status zgłoszenia";
  const preview = p.messagePreview?.trim()
    ? `<blockquote style="margin:16px 0;padding:12px 16px;border-left:3px solid #c9a227;background:#fafafa;color:#3f3f46;">${escapeHtml(p.messagePreview)}</blockquote>`
    : "";
  const statusLine =
    p.newStatus && p.event === "status_changed"
      ? `<p><strong>Nowy status:</strong> ${escapeHtml(inquiryStatusLabels[p.newStatus])}</p>`
      : "";

  return `
<!DOCTYPE html>
<html lang="pl">
<body style="font-family: system-ui, sans-serif; line-height: 1.55; color: #18181b; max-width: 560px;">
  ${eventIntro(p, forAdmin)}
  ${statusLine}
  ${preview}
  <p><a href="${escapeHtml(link)}" style="color:#9f1239;">${linkLabel}</a><br/>
  <span style="font-size:0.85em;color:#71717a;">${escapeHtml(link)}</span></p>
  <p style="font-size:0.9em;color:#71717a;">Pozdrawiamy,<br/>Zespół Weddinfo</p>
</body>
</html>`.trim();
}

export async function sendInquiryEventClientEmail(
  p: InquiryEventMailPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  return sendHtmlMail({
    to: p.clientEmail,
    subject: eventSubject(p, false),
    html: buildEventHtml(p, false),
  });
}

export async function sendInquiryEventAdminEmail(
  p: InquiryEventMailPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const to = getAdminNotifyEmail();
  if (!to) return { ok: false, error: "Brak adresu powiadomień admina." };
  return sendHtmlMail({
    to,
    subject: eventSubject(p, true),
    html: buildEventHtml(p, true),
  });
}

export async function notifyInquiryEvent(
  p: InquiryEventMailPayload,
): Promise<void> {
  const client = await sendInquiryEventClientEmail(p);
  if (!client.ok) console.error("[notifyInquiryEvent] client mail failed", client.error);
  const admin = await sendInquiryEventAdminEmail(p);
  if (!admin.ok) console.error("[notifyInquiryEvent] admin mail failed", admin.error);
}

function buildClientConfirmationHtml(p: InquiryMailPayload): string {
  const safe = {
    name: escapeHtml(p.displayName),
    type: escapeHtml(getInquiryTabLabel(p.inquiryType)),
    id: escapeHtml(p.publicId),
    pass: escapeHtml(p.guestPassword),
    link: escapeHtml(statusUrl(p.publicId)),
    eta: escapeHtml(RESPONSE_TIME_LABEL),
  };

  return `
<!DOCTYPE html>
<html lang="pl">
<body style="font-family: system-ui, sans-serif; line-height: 1.55; color: #18181b; max-width: 560px;">
  <p>Dzień dobry ${safe.name},</p>
  <p>Dziękujemy za przesłanie formularza <strong>${safe.type}</strong> w Weddinfo.</p>
  <p><strong>Numer zgłoszenia:</strong> <code style="background:#f4f4f5;padding:2px 8px;border-radius:4px;">#${safe.id}</code></p>
  <p><strong>Hasło do statusu:</strong> <code style="background:#fff8eb;padding:2px 10px;border-radius:4px;font-size:1.05em;">${safe.pass}</code></p>
  <p>Przewidywany czas odpowiedzi: <strong>${safe.eta}</strong>.</p>
  <p><a href="${safe.link}" style="color:#9f1239;">Sprawdź status zgłoszenia</a><br/>
  <span style="font-size:0.85em;color:#71717a;">${safe.link}</span></p>
  <p style="font-size:0.9em;color:#71717a;">Zachowaj numer i hasło — będą potrzebne do podglądu statusu i dalszej korespondencji.</p>
  <p style="font-size:0.9em;color:#71717a;">Pozdrawiamy,<br/>Zespół Weddinfo</p>
</body>
</html>`.trim();
}

function buildAdminNotificationHtml(p: InquiryMailPayload): string {
  const safe = {
    type: escapeHtml(getInquiryTabLabel(p.inquiryType)),
    id: escapeHtml(p.publicId),
    name: escapeHtml(p.displayName),
    email: escapeHtml(p.clientEmail),
    link: escapeHtml(statusUrl(p.publicId)),
  };

  return `
<!DOCTYPE html>
<html lang="pl">
<body style="font-family: system-ui, sans-serif; line-height: 1.55; color: #18181b;">
  <p>Nowe zgłoszenie w <strong>Weddinfo</strong>.</p>
  <p><strong>Formularz:</strong> ${safe.type}</p>
  <p><strong>Numer:</strong> #${safe.id}</p>
  <p><strong>Kontakt:</strong> ${safe.name} &lt;${safe.email}&gt;</p>
  <p><a href="${escapeHtml(adminUrl(p.publicId))}">Panel admina — szczegóły zgłoszenia</a><br/>
  <a href="${safe.link}">Widok klienta</a></p>
</body>
</html>`.trim();
}

export async function sendInquiryConfirmationEmail(
  p: InquiryMailPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  return sendHtmlMail({
    to: p.clientEmail,
    subject: `Weddinfo — potwierdzenie zgłoszenia #${p.publicId}`,
    html: buildClientConfirmationHtml(p),
  });
}

export async function sendInquiryAdminNotificationEmail(
  p: InquiryMailPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const to = getAdminNotifyEmail();
  if (!to) return { ok: false, error: "Brak adresu powiadomień admina." };
  return sendHtmlMail({
    to,
    subject: `Weddinfo admin — ${getInquiryTabLabel(p.inquiryType)} #${p.publicId}`,
    html: buildAdminNotificationHtml(p),
  });
}
