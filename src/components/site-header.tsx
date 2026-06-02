"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RealizacjeNavLink } from "@/components/realizacje-nav-link";
import { WeddinfoWordmark } from "@/components/weddinfo-wordmark";
import { landingNavCta, landingNavLinks } from "@/data/landing-nav-links";

const SCROLL_REVEAL_PX = 72;

const navLinkClass =
  "touch-manipulation inline-flex min-h-10 items-center justify-center px-1.5 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-white/80 transition hover:text-[var(--gold)] [-webkit-tap-highlight-color:transparent] lg:px-2 lg:text-[11px]";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [visible, setVisible] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_REVEAL_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const linkHref = (href: string) => {
    if (href.startsWith("/")) return href;
    return isHome ? href : `/${href}`;
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-[var(--bg-dark)]/95 backdrop-blur-md transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
      }`}
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <div className="flex min-h-[3.75rem] w-full items-center justify-between gap-4 px-5 sm:min-h-[4.25rem] sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <WeddinfoWordmark size="header" />

        <div className="ml-auto flex items-center">
          <nav aria-label="Menu główne" className="hidden sm:block">
            <ul className="flex items-center gap-4 lg:gap-5 xl:gap-6">
              {landingNavLinks.map((item) =>
                item.href === "#realizacje" ? (
                  <li key={item.href}>
                    <RealizacjeNavLink className={navLinkClass} label="Portfolio" />
                  </li>
                ) : (
                  <li key={item.href}>
                    <a href={linkHref(item.href)} className={navLinkClass}>
                      {item.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <Link
            href={landingNavCta.href}
            className="btn-primary ml-4 shrink-0 px-3 py-2 text-[9px] sm:ml-5 sm:px-5 sm:text-[11px] lg:ml-6"
          >
            {landingNavCta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
