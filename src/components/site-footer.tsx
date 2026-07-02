import Link from "next/link";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";

const footerLinks = [
  { href: "/realizacje", label: "Realizacje" },
  { href: "/wspolpraca", label: "Współpraca" },
  { href: "/zapytanie", label: "Status zlecenia" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/polityka-prywatnosci", label: "RODO" },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-[var(--bg-dark)] text-white">
      <LandingSectionInner className="py-10 sm:py-12">
        <nav
          aria-label="Stopka — linki"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-medium uppercase tracking-[0.12em]"
        >
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="touch-manipulation text-white/65 transition hover:text-[var(--gold)] [-webkit-tap-highlight-color:transparent]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 text-center text-sm text-white/45">
          <p>© {new Date().getFullYear()} Weddinfo. Wszelkie prawa zastrzeżone.</p>
        </div>
      </LandingSectionInner>
    </footer>
  );
}
