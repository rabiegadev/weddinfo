import Link from "next/link";
import { RealizacjeNavLink } from "@/components/realizacje-nav-link";
import { WeddinfoWordmark } from "@/components/weddinfo-wordmark";
import { landingNavCta, landingNavLinks } from "@/data/landing-nav-links";

type LandingNavProps = {
  variant?: "hero" | "default";
};

export function LandingNav({ variant = "hero" }: LandingNavProps) {
  const isHero = variant === "hero";
  const linkClass = isHero
    ? "text-[10px] font-medium uppercase tracking-[0.16em] text-white/90 transition hover:text-[var(--gold)] sm:text-[11px] lg:text-xs"
    : "text-[11px] font-medium uppercase tracking-[0.14em] text-white/75 transition hover:text-[var(--gold)]";

  return (
    <nav
      className={`relative z-20 flex w-full items-center justify-between gap-4 ${
        isHero ? "mb-6 sm:mb-8" : ""
      }`}
      aria-label="Menu główne"
    >
      <WeddinfoWordmark size="hero" />

      <div className="ml-auto flex items-center">
        <ul className="hidden items-center gap-4 sm:flex lg:gap-5 xl:gap-6">
          {landingNavLinks.map((item) => (
            <li key={item.href}>
              {item.href === "#realizacje" ? (
                <RealizacjeNavLink className={linkClass} label="Portfolio" />
              ) : (
                <a href={item.href} className={linkClass}>
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <Link
          href={landingNavCta.href}
          className="btn-primary ml-4 shrink-0 px-3 py-2 text-[9px] sm:ml-5 sm:px-5 sm:text-[11px] lg:ml-6"
        >
          {landingNavCta.label}
        </Link>
      </div>
    </nav>
  );
}
