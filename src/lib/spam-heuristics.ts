import { isDisposableEmailDomain } from "@/data/disposable-email-domains";

/** Maksymalna liczba linków dopuszczalna w całym zgłoszeniu. */
const MAX_LINKS = 3;

const URL_PATTERN = /(https?:\/\/|www\.)[^\s]+/gi;
const BBCODE_LINK_PATTERN = /\[url[=\]]/gi;

export type SpamCheckResult = { ok: true } | { ok: false; reason: string };

/** Liczy wystąpienia adresów URL / linków w podanym tekście. */
export function countLinks(text: string): number {
  if (!text) return 0;
  const urls = text.match(URL_PATTERN)?.length ?? 0;
  const bbcode = text.match(BBCODE_LINK_PATTERN)?.length ?? 0;
  return urls + bbcode;
}

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.trim().toLowerCase();
  if (!domain) return false;
  return isDisposableEmailDomain(domain);
}

/**
 * Heurystyka anty-spam dla treści zgłoszenia:
 * - odrzuca jednorazowe adresy e-mail,
 * - odrzuca zgłoszenia z nadmierną liczbą linków (typowy spam).
 */
export function checkInquiryForSpam(input: {
  email: string;
  textFields: (string | null | undefined)[];
}): SpamCheckResult {
  if (isDisposableEmail(input.email)) {
    return {
      ok: false,
      reason: "Podaj stały adres e-mail — adresy tymczasowe nie są obsługiwane.",
    };
  }

  const totalLinks = input.textFields.reduce((sum, field) => sum + countLinks(field ?? ""), 0);
  if (totalLinks > MAX_LINKS) {
    return {
      ok: false,
      reason: "Wiadomość zawiera zbyt wiele linków. Usuń część odnośników i spróbuj ponownie.",
    };
  }

  return { ok: true };
}
