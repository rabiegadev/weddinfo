export type PortfolioExampleBadge = "demo" | "live";

export type PortfolioExample = {
  couple: string;
  slug: string;
  palette: string;
  accent: string;
  date: string;
  /** Zrzut ekranu z `/public` — zastępuje szkic przeglądarki w nagłówku karty */
  screenshotSrc?: string;
  /** Publiczny URL działającej wizytówki */
  liveUrl?: string;
  /** Krótki opis pod zdjęciem (zamiast domyślnego) */
  summary?: string;
  /** Tekst pod nagłówkiem zamiast `slug.weddinfo.pl` */
  urlDisplay?: string;
  badge?: PortfolioExampleBadge;
};

export const portfolioExamples: readonly PortfolioExample[] = [
  {
    couple: "Ania & Maciej",
    slug: "aniaimaciej",
    palette: "from-[var(--w-cream-a)] via-[var(--w-beige-a)]/80 to-[var(--w-blush-a)]/50",
    accent: "text-[var(--w-gold-deep)]",
    date: "12 września 2026",
    screenshotSrc: "/images/portfolio/ania-maciej-ex1.png",
    liveUrl: "https://example1.weddinfo.pl/",
    urlDisplay: "example1.weddinfo.pl",
    summary:
      "Kompletna strona weselna: powitanie z licznikiem, harmonogram, RSVP, dojazd, nocleg, galeria i kontakt — spójna typografia i stonowana kolorystyka.",
    badge: "live",
  },
  {
    couple: "Paulina & Bartosz",
    slug: "paulinabartosz",
    palette: "from-[var(--w-mauve)]/20 via-[#f8f4fb] to-[var(--w-pink-dust)]/35",
    accent: "text-[var(--w-gold-deep)]",
    date: "25 września 2026",
    screenshotSrc: "/images/portfolio/paulina-bartosz-ex2.png",
    liveUrl: "https://example2.weddinfo.pl/",
    urlDisplay: "example2.weddinfo.pl",
    summary:
      "Lawendowe tło z delikatnym wzorem, złote kaligraficzne imiona i fioletowe akcenty w menu oraz etykietach; treść na białych kartach z miękkim cieniem — harmonogram, RSVP, dojazd, kontakt i odliczanie do ślubu w jednej spójnej całości.",
    badge: "live",
  },
  {
    couple: "Karolina & Paweł",
    slug: "karolinapawel",
    palette:
      "from-emerald-50/90 via-[var(--w-cream-a)] to-[var(--w-beige-a)]/70",
    accent: "text-emerald-800",
    date: "18 września 2026",
    screenshotSrc: "/images/portfolio/karolina-pawel-ex3.png",
    liveUrl: "http://example3.weddinfo.pl/",
    urlDisplay: "example3.weddinfo.pl",
    summary:
      "Żywa wizytówka szablonu „eukaliptus · lawenda · biel”: zaproszenie z datą i miejscem (Żabi Dwór Radwanów), odliczanie do ślubu, harmonogram dnia, RSVP (demonstracja zapisu w przeglądarce), mapa Google, nocleg i poprawiny, kontakt oraz odnośnik do galerii gości. Podgląd działa pod adresem HTTP — po konfiguracji domeny na Vercel pojawi się standardowy certyfikat HTTPS.",
    badge: "live",
  },
  {
    couple: "Ola & Michał",
    slug: "olaimichal",
    palette: "from-[var(--w-beige-b)] to-[var(--w-cream-b)]",
    accent: "text-[var(--foreground)]",
    date: "6 lipca",
    liveUrl: "https://example4.weddinfo.pl/",
    urlDisplay: "example4.weddinfo.pl",
  },
  {
    couple: "Natalia & Paweł",
    slug: "nataliaipawel",
    palette: "from-[var(--w-blush-b)]/80 to-[var(--w-mauve)]/25",
    accent: "text-[var(--w-mauve)]",
    date: "23 sierpnia",
    liveUrl: "https://example5.weddinfo.pl/",
    urlDisplay: "example5.weddinfo.pl",
  },
  {
    couple: "Julia & Marcin",
    slug: "juliamarcin",
    palette: "from-[var(--w-cream-a)] to-[var(--w-gold-soft-a)]/35",
    accent: "text-[var(--w-gold-deep)]",
    date: "5 października",
    liveUrl: "https://example6.weddinfo.pl/",
    urlDisplay: "example6.weddinfo.pl",
  },
  {
    couple: "Zosia & Adam",
    slug: "zosiaadam",
    palette: "from-[var(--w-mauve)]/30 to-[var(--w-cream-b)]",
    accent: "text-[var(--w-mauve)]",
    date: "18 maja",
    liveUrl: "https://example7.weddinfo.pl/",
    urlDisplay: "example7.weddinfo.pl",
  },
  {
    couple: "Ewa & Kacper",
    slug: "ewakacper",
    palette: "from-[var(--w-blush-a)]/90 to-[var(--w-beige-a)]",
    accent: "text-[var(--foreground)]",
    date: "12 lipca",
    liveUrl: "https://example8.weddinfo.pl/",
    urlDisplay: "example8.weddinfo.pl",
  },
  {
    couple: "Karolina & Piotr",
    slug: "karolinapiotr",
    palette: "from-[var(--w-pink-dust)]/70 to-[var(--w-blush-b)]/50",
    accent: "text-[var(--w-gold-deep)]",
    date: "30 sierpnia",
    liveUrl: "https://example9.weddinfo.pl/",
    urlDisplay: "example9.weddinfo.pl",
  },
  {
    couple: "Marta & Łukasz",
    slug: "martalukasz",
    palette: "from-[var(--w-beige-b)] to-[var(--w-pink-dust)]/40",
    accent: "text-[var(--foreground)]",
    date: "7 czerwca",
    liveUrl: "https://example10.weddinfo.pl/",
    urlDisplay: "example10.weddinfo.pl",
  },
];

export const portfolioFeatured = portfolioExamples.slice(0, 3);
