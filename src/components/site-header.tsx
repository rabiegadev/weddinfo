"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WedinfoLogo } from "@/components/wedinfo-logo";

const SCROLL_REVEAL_PX = 56;

export function SiteHeader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(pathname !== "/");

  useEffect(() => {
    if (pathname !== "/") {
      setVisible(true);
      return;
    }
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_REVEAL_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-[var(--w-gold-deep)]/12 bg-[var(--w-cream-b)]/92 backdrop-blur-lg transition-[transform,opacity,box-shadow] duration-500 ease-out ${
        visible
          ? "translate-y-0 opacity-100 shadow-[0_4px_24px_rgba(61,52,41,0.08)]"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
          <WedinfoLogo variant="brand" size="md" />
        </Link>
        <nav className="flex max-w-[min(100%,28rem)] flex-wrap items-center justify-end gap-x-2.5 gap-y-1 text-xs sm:max-w-none sm:gap-x-4 sm:text-sm">
          <Link
            href="/#realizacje"
            className="text-[var(--foreground)]/65 transition hover:text-[var(--w-gold-deep)]"
          >
            Realizacje
          </Link>
          <Link
            href="/#opinie"
            className="text-[var(--foreground)]/65 transition hover:text-[var(--w-gold-deep)]"
          >
            Opinie
          </Link>
          <Link
            href="/#kontakt"
            className="text-[var(--foreground)]/65 transition hover:text-[var(--w-gold-deep)]"
          >
            Kontakt
          </Link>
          <Link
            href="/zloz-zapytanie"
            className="font-medium text-[var(--w-gold-deep)] transition hover:text-[var(--w-gold-deep)]/85"
          >
            Złóż zapytanie
          </Link>
          <Link
            href="/admin/login"
            className="text-[var(--foreground)]/45 transition hover:text-[var(--foreground)]/70"
          >
            Panel
          </Link>
        </nav>
      </div>
    </header>
  );
}
