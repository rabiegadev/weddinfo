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
      className={`fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-[#1c1815]/52 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150 transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none supports-[backdrop-filter]:bg-[#1c1815]/44 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
      style={{ WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden" }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:gap-4 sm:px-6">
        <Link href="/" className="min-w-0 shrink-0 transition-opacity hover:opacity-90">
          <WedinfoLogo variant="light" size="md" />
        </Link>
        <nav className="flex min-w-0 flex-nowrap items-center justify-end gap-x-2 overflow-x-auto whitespace-nowrap text-[11px] [scrollbar-width:none] sm:gap-x-3 sm:text-sm md:gap-x-4 [&::-webkit-scrollbar]:hidden">
          <Link
            href="/#realizacje"
            className="text-[#f2ebe3]/72 transition hover:text-[#faf6ee]"
          >
            Realizacje
          </Link>
          <Link
            href="/#opinie"
            className="text-[#f2ebe3]/72 transition hover:text-[#faf6ee]"
          >
            Opinie
          </Link>
          <Link
            href="/#kontakt"
            className="text-[#f2ebe3]/72 transition hover:text-[#faf6ee]"
          >
            Kontakt
          </Link>
          <Link
            href="/zloz-zapytanie"
            className="font-medium text-[#f0d9a8] transition hover:text-[#faf0dc]"
          >
            Złóż zapytanie
          </Link>
          <Link
            href="/admin/login"
            className="text-[#f2ebe3]/42 transition hover:text-[#f2ebe3]/68"
          >
            Panel
          </Link>
        </nav>
      </div>
    </header>
  );
}
