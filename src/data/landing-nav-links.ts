/** Linki menu strony głównej — zgodne z układem z inspiracji. */
export const landingNavLinks = [
  { href: "#o-nas", label: "O nas" },
  { href: "/realizacje", label: "Portfolio" },
  { href: "/wspolpraca", label: "Współpraca" },
  { href: "/zapytanie", label: "Status zlecenia" },
  { href: "/cennik", label: "Cennik" },
  { href: "#faq", label: "FAQ" },
] as const;

export const landingNavCta = {
  href: "/kontakt",
  label: "Kontakt",
} as const;
