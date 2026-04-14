export const weddingTemplateOptions = [
  "Klasyczny Elegancki",
  "Nowoczesny Minimal",
  "Romantyczny Kwiatowy",
  "Boho Naturalny",
] as const;

export type WeddingTemplateOption = (typeof weddingTemplateOptions)[number];
