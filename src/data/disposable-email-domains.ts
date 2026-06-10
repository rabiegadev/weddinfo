/**
 * Lista popularnych domen e-mail jednorazowych / tymczasowych.
 * Celowo zwięzła — wyłapuje najczęstsze przypadki bez fałszywych trafień.
 */
export const disposableEmailDomains = new Set<string>([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "guerrillamail.biz",
  "sharklasers.com",
  "grr.la",
  "10minutemail.com",
  "10minutemail.net",
  "tempmail.com",
  "temp-mail.org",
  "tempmailo.com",
  "yopmail.com",
  "yopmail.fr",
  "throwawaymail.com",
  "trashmail.com",
  "trashmail.de",
  "getnada.com",
  "nada.email",
  "dispostable.com",
  "maildrop.cc",
  "mintemail.com",
  "fakeinbox.com",
  "spamgourmet.com",
  "mailnesia.com",
  "moakt.com",
  "mohmal.com",
  "emailondeck.com",
  "tempinbox.com",
  "mailcatch.com",
  "discard.email",
  "mytemp.email",
  "burnermail.io",
  "tempr.email",
  "1secmail.com",
  "1secmail.net",
  "1secmail.org",
  "wegwerfmail.de",
  "spam4.me",
  "harakirimail.com",
]);

export function isDisposableEmailDomain(domain: string): boolean {
  return disposableEmailDomains.has(domain.toLowerCase());
}
