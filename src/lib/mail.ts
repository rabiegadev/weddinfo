import nodemailer from "nodemailer";
import type { InquiryType } from "@/db/schema";
import { getInquiryTabLabel, RESPONSE_TIME_LABEL } from "@/config/inquiry-tabs";

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
  <p><a href="${safe.link}">Podgląd statusu (widok klienta)</a></p>
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
