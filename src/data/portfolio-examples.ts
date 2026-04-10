export type PortfolioExample = {
  couple: string;
  slug: string;
  palette: string;
  accent: string;
  date: string;
};

export const portfolioExamples: readonly PortfolioExample[] = [
  {
    couple: "Kamila & Bartek",
    slug: "kamilaibartek",
    palette: "from-[var(--w-pink-dust)]/90 to-[var(--w-cream-a)]",
    accent: "text-[var(--w-gold-deep)]",
    date: "14 września",
  },
  {
    couple: "Ola & Michał",
    slug: "olaimichal",
    palette: "from-[var(--w-beige-b)] to-[var(--w-cream-b)]",
    accent: "text-[var(--foreground)]",
    date: "6 lipca",
  },
  {
    couple: "Natalia & Paweł",
    slug: "nataliaipawel",
    palette: "from-[var(--w-blush-b)]/80 to-[var(--w-mauve)]/25",
    accent: "text-[var(--w-mauve)]",
    date: "23 sierpnia",
  },
  {
    couple: "Julia & Marcin",
    slug: "juliamarcin",
    palette: "from-[var(--w-cream-a)] to-[var(--w-gold-soft-a)]/35",
    accent: "text-[var(--w-gold-deep)]",
    date: "5 października",
  },
  {
    couple: "Zosia & Adam",
    slug: "zosiaadam",
    palette: "from-[var(--w-mauve)]/30 to-[var(--w-cream-b)]",
    accent: "text-[var(--w-mauve)]",
    date: "18 maja",
  },
  {
    couple: "Ewa & Kacper",
    slug: "ewakacper",
    palette: "from-[var(--w-blush-a)]/90 to-[var(--w-beige-a)]",
    accent: "text-[var(--foreground)]",
    date: "12 lipca",
  },
  {
    couple: "Karolina & Piotr",
    slug: "karolinapiotr",
    palette: "from-[var(--w-pink-dust)]/70 to-[var(--w-blush-b)]/50",
    accent: "text-[var(--w-gold-deep)]",
    date: "30 sierpnia",
  },
  {
    couple: "Marta & Łukasz",
    slug: "martalukasz",
    palette: "from-[var(--w-beige-b)] to-[var(--w-pink-dust)]/40",
    accent: "text-[var(--foreground)]",
    date: "7 czerwca",
  },
];

export const portfolioFeatured = portfolioExamples.slice(0, 3);
