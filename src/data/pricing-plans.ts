export type PricingPlanId = "podstawowy" | "premium" | "indywidual";

export type PricingDetailFeature = {
  title: string;
  description: string;
};

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  price: string;
  priceNote: string;
  tagline: string;
  overviewFeatures: readonly string[];
  detailFeatures: readonly PricingDetailFeature[];
  highlighted: boolean;
  unavailable: boolean;
  contactTyp: "premium" | "individual";
};

export const pricingExtras = [
  {
    title: "Własna domena",
    description: "Skorzystaj z naszych subdomen lub przedstaw swoją propozycję!",
  },
  {
    title: "Aktualizacje w cenie",
    description:
      "Zmienił się świadek? A może podałeś zły numer telefonu? Takie poprawki realizujemy bez dodatkowych opłat.",
  },
] as const;

export const pricingPlans: readonly PricingPlan[] = [
  {
    id: "podstawowy",
    name: "Podstawowy",
    price: "149 zł",
    priceNote: "jednorazowo",
    tagline: "Szybki start z gotowym szablonem",
    overviewFeatures: [
      "Strona z szablonu",
      "Harmonogram dnia",
      "RSVP",
      "Dojazd",
      "Kontakt",
    ],
    detailFeatures: [
      {
        title: "Gotowy szablon",
        description: "Sprawdzony układ sekcji dopasowany do większości wesel.",
      },
      {
        title: "Harmonogram dnia",
        description: "Przejrzysty plan wydarzeń dla Was i gości.",
      },
      {
        title: "RSVP",
        description: "Formularz potwierdzenia obecności w cenie pakietu.",
      },
      {
        title: "Dojazd i mapa",
        description: "Wskazówki dojazdu do sali i kościoła.",
      },
      {
        title: "Sekcja kontakt",
        description: "Dane kontaktowe pary młodej w jednym miejscu.",
      },
      {
        title: "Responsywność",
        description: "Strona czytelna na telefonie i komputerze.",
      },
    ],
    highlighted: false,
    unavailable: true,
    contactTyp: "premium",
  },
  {
    id: "premium",
    name: "Premium",
    price: "299 zł",
    priceNote: "jednorazowo",
    tagline: "Wszystko, czego potrzebujecie i jeszcze więcej",
    overviewFeatures: [
      "Wszystko z pakietu Podstawowy",
      "Indywidualne kolory",
      "Własna domena",
      "Noclegi",
      "Galeria zdjęć",
    ],
    detailFeatures: [
      {
        title: "Indywidualny projekt",
        description: "Kolorystyka i detale dopasowane do charakteru Waszego wesela.",
      },
      {
        title: "Własna domena",
        description: "Subdomena Weddinfo lub podpięcie Waszej domeny.",
      },
      {
        title: "Mobilna wersja",
        description: "Goście wygodnie korzystają ze strony na smartfonie.",
      },
      {
        title: "Potwierdzenie obecności",
        description: "RSVP z zebraniem odpowiedzi w jednym miejscu.",
      },
      {
        title: "Galeria zdjęć",
        description: "Miejsce na Wasze zdjęcia i wspomnienia z dnia ślubu.",
      },
      {
        title: "Wsparcie techniczne",
        description: "Pomoc przy aktualizacji treści przed weselem.",
      },
    ],
    highlighted: true,
    unavailable: false,
    contactTyp: "premium",
  },
  {
    id: "indywidual",
    name: "Indywidual",
    price: "od 599 zł",
    priceNote: "wycena indywidualna",
    tagline: "Projekt szyty na miarę — bez kompromisów",
    overviewFeatures: [
      "Projekt od zera",
      "Pełna personalizacja",
      "Dodatkowe sekcje",
      "Zaawansowane funkcje",
      "Priorytetowa realizacja",
    ],
    detailFeatures: [
      {
        title: "Projekt od zera",
        description: "Unikalny layout stworzony wyłącznie dla Was.",
      },
      {
        title: "Pełna personalizacja",
        description: "Sekcje, typografia i grafika dopasowane do Waszej wizji.",
      },
      {
        title: "Dodatkowe sekcje",
        description: "Noclegi, poprawiny, FAQ, lista prezentów — co potrzebujecie.",
      },
      {
        title: "Zaawansowane funkcje",
        description: "Hasło do strony, kod QR, rozbudowane RSVP i więcej.",
      },
      {
        title: "Priorytetowa realizacja",
        description: "Szybszy harmonogram prac i dedykowana opieka.",
      },
      {
        title: "Konsultacje i iteracje",
        description: "Wspólne dopracowanie projektu aż do efektu „wow”.",
      },
    ],
    highlighted: false,
    unavailable: false,
    contactTyp: "individual",
  },
] as const;

export function getPricingPlan(id: PricingPlanId): PricingPlan | undefined {
  return pricingPlans.find((plan) => plan.id === id);
}

export function pricingPlanAnchor(id: PricingPlanId): string {
  return `/cennik#${id}`;
}

export function pricingContactHref(typ: PricingPlan["contactTyp"]): string {
  if (typ === "premium") return "/kontakt?typ=premium";
  return "/kontakt?typ=individual";
}
