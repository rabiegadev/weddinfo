export type PricingPlanId = "podstawowy" | "indywidual";

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
};

export const pricingPlans: readonly PricingPlan[] = [
  {
    id: "podstawowy",
    name: "Pakiet podstawowy",
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
  },
  {
    id: "indywidual",
    name: "Pakiet indywidualny",
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
    highlighted: true,
    unavailable: true,
  },
] as const;

export function getPricingPlan(id: PricingPlanId): PricingPlan | undefined {
  return pricingPlans.find((plan) => plan.id === id);
}

export function pricingPlanAnchor(id: PricingPlanId): string {
  return `/cennik#${id}`;
}

export function pricingContactHref(): string {
  return "/kontakt";
}
