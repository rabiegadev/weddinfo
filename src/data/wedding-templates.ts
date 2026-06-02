/** Lista szablonów — aktualizuj ręcznie po dodaniu nowych realizacji. */
export const weddingTemplateOptions = [
  "Classic Elegance",
  "Modern Minimal",
  "Romantic Bloom",
  "Boho Natural",
] as const;

export type WeddingTemplateOption = (typeof weddingTemplateOptions)[number];
