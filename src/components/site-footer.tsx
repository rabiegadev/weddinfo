import Image from "next/image";
import Link from "next/link";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";

const footerLinks = [
  { href: "/#o-nas", label: "O nas" },
  { href: "/realizacje", label: "Realizacje" },
  { href: "/#cennik", label: "Cennik" },
  { href: "/#faq", label: "FAQ" },
  { href: "/zloz-zapytanie", label: "Kontakt" },
  { href: "/polityka-prywatnosci", label: "RODO" },
] as const;

export function SiteFooter() {
  return (
    <footer id="kontakt" className="scroll-mt-header bg-[var(--bg-dark)] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src="/images/napisz.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[center_40%]"
          />
        </div>
        <div
          className="absolute inset-0 bg-[var(--bg-dark)]/82"
          aria-hidden
        />
        <LandingSectionInner className="relative z-10 py-14 text-center sm:py-16">
          <p className="font-wedinfo-serif text-2xl text-white sm:text-3xl">
            Masz pytania? Napisz do nas!
          </p>
          <Link href="/zloz-zapytanie" className="btn-primary mt-8">
            Formularz kontaktowy
          </Link>
        </LandingSectionInner>
      </div>

      <LandingSectionInner className="border-t border-white/10 py-10 sm:py-12">
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

        <div className="mt-10 space-y-2 text-center text-sm text-white/45">
          <p>© {new Date().getFullYear()} Weddinfo. Wszelkie prawa zastrzeżone.</p>
          <p>
            Realizacja:{" "}
            <a
              href="https://rabiegadevelopment.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--gold)] underline-offset-2 transition hover:underline"
            >
              rabiegadevelopment.pl
            </a>
          </p>
        </div>
      </LandingSectionInner>
    </footer>
  );
}
