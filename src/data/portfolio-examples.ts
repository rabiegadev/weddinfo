export type PortfolioExampleBadge = "demo" | "live";

/** Pojedynczy ekran w galerii podglądu — podmień plik w /public, zachowując ścieżkę src */
export type PortfolioShowcaseSlide = {
  src: string;
  alt: string;
  caption?: string;
};

/** Galeria 4 ekranów z modalem (np. strona podziękowań po weselu) */
export type PortfolioShowcase = {
  modalLabel?: string;
  modalDescription: string;
  detailDescription: string;
  slides: readonly PortfolioShowcaseSlide[];
};

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
  /** Krótka etykieta stylu na karcie landingowej */
  styleLabel?: string;
  /** Wyróżnione sekcje na karcie landingowej (np. potwierdzenie obecności, harmonogram) */
  featureHighlights?: readonly string[];
  /** Ukryty podgląd — mocno zamazany placeholder zamiast zrzutu ekranu */
  previewHidden?: boolean;
  /** Galeria ekranów z modalem po kliknięciu */
  showcase?: PortfolioShowcase;
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
      "Kompletna strona weselna: powitanie z licznikiem, harmonogram, potwierdzenie obecności, dojazd, nocleg, galeria i kontakt — spójna typografia i stonowana kolorystyka.",
    styleLabel: "Klasyczna elegancja",
    featureHighlights: ["Potwierdzenie obecności", "Harmonogram", "Galeria"],
    badge: "live",
  },
  {
    couple: "Julia & Antoni",
    slug: "juliaantoni",
    palette: "from-[var(--w-mauve)]/20 via-[#f8f4fb] to-[var(--w-pink-dust)]/35",
    accent: "text-[var(--w-gold-deep)]",
    date: "21 czerwca 2027",
    screenshotSrc: "/images/portfolio/julaant.png",
    liveUrl: "https://weddinfo-ex5.vercel.app/",
    urlDisplay: "weddinfo-ex5.vercel.app",
    summary:
      "Elegancka wizytówka z odliczaniem do ślubu, harmonogramem dnia, lokalizacjami (kościół i sala), informacjami weselnymi (nocleg, poprawiny, dress code), opcjonalnym potwierdzeniem obecności oraz kontaktem do pary i świadków — w kolorystyce oliwki, złota i beżu.",
    styleLabel: "Oliwka · złoto · beż",
    featureHighlights: ["Odliczanie", "Harmonogram", "Potwierdzenie obecności"],
    badge: "live",
  },
  {
    couple: "Karolina & Michał",
    slug: "karolinamichal",
    palette: "from-emerald-50/90 via-[var(--w-cream-a)] to-[var(--w-beige-a)]/70",
    accent: "text-emerald-800",
    date: "15 września 2027",
    screenshotSrc: "/images/portfolio/example4.png",
    liveUrl: "https://weddinfo-ex4.vercel.app/",
    urlDisplay: "weddinfo-ex4.vercel.app",
    summary:
      "Stonowana wizytówka z powitaniem gości, rozwijanym harmonogramem dnia (ceremonia, sesja zdjęciowa, kolacja), sekcją dojazdu z mapą Google oraz transportem powrotnym — praktyczne informacje w eleganckiej, czytelnej formie.",
    styleLabel: "Elegancki minimalizm",
    featureHighlights: ["Harmonogram", "Dojazd", "Transport powrotny"],
    badge: "live",
  },
  {
    couple: "Iga & Kamil",
    slug: "igakamil",
    palette: "from-[var(--w-beige-b)] to-[var(--w-cream-b)]",
    accent: "text-[var(--foreground)]",
    date: "19 lipca 2025",
    urlDisplay: "Strona po weselu",
    summary:
      "Prywatna strona wspomnień po weselu — podziękowania, filmy, teledysk i galeria zdjęć do pobrania, chroniona hasłem.",
    styleLabel: "Podziękowania po weselu",
    featureHighlights: ["Podziękowania", "Filmy i teledysk", "Galeria zdjęć"],
    showcase: {
      modalLabel: "Strona po weselu",
      modalDescription:
        "Po uroczystości strona zamienia się w prywatne podziękowania dla gości — z dostępem do filmu, teledysku, galerii zdjęć oraz możliwością pobrania materiałów. Dostęp zabezpieczony hasłem.",
      detailDescription:
        "Projekt pokazuje etap po weselu: elegancka, ciemna strona z podziękowaniami, kartami pobierania filmu weselnego, teledysku i galerii zdjęć oraz rozbudowaną galerią z ośmią czasu i masowym pobieraniem plików. Całość można zabezpieczyć hasłem i aktywować automatycznie następnego dnia po uroczystości.",
      slides: [
        {
          src: "/images/portfolio/poweselu/igakamil_poweselu.png",
          alt: "Ekran logowania hasłem",
          caption: "Prywatny dostęp — strona chroniona hasłem",
        },
        {
          src: "/images/portfolio/poweselu/igakamil_poweselu2.png",
          alt: "Podziękowania z parą młodą",
          caption: "Podziękowania i powitanie gości po weselu",
        },
        {
          src: "/images/portfolio/poweselu/igakamil_poweselu3.png",
          alt: "Karty z filmem, teledyskiem i zdjęciami",
          caption: "Odnośniki do filmu, teledysku i galerii zdjęć",
        },
        {
          src: "/images/portfolio/poweselu/igakamil_poweselu4.png",
          alt: "Galeria zdjęć z osią czasu",
          caption: "Galeria zdjęć z podziałem na etapy dnia i pobieraniem plików",
        },
      ],
    },
  },
  {
    couple: "Natalia & Paweł",
    slug: "nataliaipawel",
    palette: "from-[var(--w-blush-b)]/80 to-[var(--w-mauve)]/25",
    accent: "text-[var(--w-mauve)]",
    date: "23 sierpnia",
    liveUrl: "https://example5.weddinfo.pl/",
    urlDisplay: "example5.weddinfo.pl",
    previewHidden: true,
  },
  {
    couple: "Julia & Marcin",
    slug: "juliamarcin",
    palette: "from-[var(--w-cream-a)] to-[var(--w-gold-soft-a)]/35",
    accent: "text-[var(--w-gold-deep)]",
    date: "5 października",
    liveUrl: "https://example6.weddinfo.pl/",
    urlDisplay: "example6.weddinfo.pl",
    previewHidden: true,
  },
  {
    couple: "Zosia & Adam",
    slug: "zosiaadam",
    palette: "from-[var(--w-mauve)]/30 to-[var(--w-cream-b)]",
    accent: "text-[var(--w-mauve)]",
    date: "18 maja",
    liveUrl: "https://example7.weddinfo.pl/",
    urlDisplay: "example7.weddinfo.pl",
    previewHidden: true,
  },
  {
    couple: "Ewa & Kacper",
    slug: "ewakacper",
    palette: "from-[var(--w-blush-a)]/90 to-[var(--w-beige-a)]",
    accent: "text-[var(--foreground)]",
    date: "12 lipca",
    liveUrl: "https://example8.weddinfo.pl/",
    urlDisplay: "example8.weddinfo.pl",
    previewHidden: true,
  },
  {
    couple: "Karolina & Piotr",
    slug: "karolinapiotr",
    palette: "from-[var(--w-pink-dust)]/70 to-[var(--w-blush-b)]/50",
    accent: "text-[var(--w-gold-deep)]",
    date: "30 sierpnia",
    liveUrl: "https://example9.weddinfo.pl/",
    urlDisplay: "example9.weddinfo.pl",
    previewHidden: true,
  },
  {
    couple: "Marta & Łukasz",
    slug: "martalukasz",
    palette: "from-[var(--w-beige-b)] to-[var(--w-pink-dust)]/40",
    accent: "text-[var(--foreground)]",
    date: "7 czerwca",
    liveUrl: "https://example10.weddinfo.pl/",
    urlDisplay: "example10.weddinfo.pl",
    previewHidden: true,
  },
];

export const portfolioFeatured = portfolioExamples.slice(0, 3);
