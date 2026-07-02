"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { RealizacjeNavLink } from "@/components/realizacje-nav-link";
import { WeddinfoWordmark } from "@/components/weddinfo-wordmark";
import { landingNavCta, landingNavLinks } from "@/data/landing-nav-links";

/** Odległość scrolla (px), w której menu przechodzi z ukrytego do widocznego. */
const HEADER_REVEAL_DISTANCE = 140;

const navLinkClass =
  "touch-manipulation inline-flex min-h-10 items-center justify-center px-1.5 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-white/80 transition hover:text-[var(--gold)] [-webkit-tap-highlight-color:transparent] lg:px-2 lg:text-[11px]";

function updateHeaderReveal(header: HTMLElement) {
  const progress = Math.min(1, Math.max(0, window.scrollY / HEADER_REVEAL_DISTANCE));
  header.style.setProperty("--site-header-reveal", progress.toFixed(4));

  if (progress >= 0.98) {
    header.dataset.revealed = "true";
  } else if (progress <= 0.02) {
    header.dataset.revealed = "false";
  } else {
    header.dataset.revealed = "partial";
  }
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    const header = headerRef.current;
    if (!header) {
      return;
    }

    let frame = 0;

    const onScroll = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateHeaderReveal(header);
      });
    };

    updateHeaderReveal(header);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [isHome]);

  if (!isHome) {
    return null;
  }

  const linkHref = (href: string) => {
    if (href.startsWith("/")) return href;
    return `/${href}`;
  };

  return (
    <header
      ref={headerRef}
      data-revealed="false"
      className="site-header-reveal fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-[var(--bg-dark)]/95 backdrop-blur-md motion-reduce:transition-[transform,opacity] motion-reduce:duration-200 motion-reduce:ease-out"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <div className="flex w-full items-center justify-between gap-4 px-5 py-1.5 sm:px-8 sm:py-2 md:px-12 lg:px-16 xl:px-20">
        <WeddinfoWordmark size="header" />

        <div className="ml-auto flex items-center">
          <nav aria-label="Menu główne" className="hidden sm:block">
            <ul className="flex items-center gap-4 lg:gap-5 xl:gap-6">
              {landingNavLinks.map((item) =>
                item.href === "/realizacje" ? (
                  <li key={item.href}>
                    <RealizacjeNavLink className={navLinkClass} label={item.label} />
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
