export type LandingPortfolioItem = {
  couple: string;
  style: string;
  imageSrc: string;
  href: string;
};

export const landingPortfolioFeatured: readonly LandingPortfolioItem[] = [
  {
    couple: "Ania & Maciej",
    style: "Klasyczny",
    imageSrc: "/images/r1.jpg",
    href: "https://example1.weddinfo.pl/",
  },
  {
    couple: "Paulina & Bartosz",
    style: "Glamour",
    imageSrc: "/images/r2.jpg",
    href: "https://example2.weddinfo.pl/",
  },
  {
    couple: "Karolina & Paweł",
    style: "Eukaliptus",
    imageSrc: "/images/r3.png",
    href: "http://example3.weddinfo.pl/",
  },
  {
    couple: "Ola & Michał",
    style: "Minimal",
    imageSrc: "/images/r4.png",
    href: "https://example4.weddinfo.pl/",
  },
] as const;
