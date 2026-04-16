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
      style={{
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:min-h-16 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="touch-manipulation min-w-0 shrink-0 py-2 transition-opacity hover:opacity-90 [-webkit-tap-highlight-color:transparent]"
        >
          <WedinfoLogo variant="light" size="md" />
        </Link>
        <nav className="flex min-w-0 flex-1 items-center justify-end gap-x-0.5 text-[11px] sm:gap-x-1 sm:text-sm md:gap-x-2">
          {/*
            overflow-x-auto obcina dropdown „Oferta” (overflow-y staje się ukryty) — przewijamy tylko
            lewą grupę linków, a <details> zostaje poza kontenerem z overflow.
          */}
          <div className="flex min-w-0 max-w-[46vw] flex-nowrap items-center gap-x-0.5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] sm:max-w-none sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            <Link
              href="/#realizacje"
              className="touch-manipulation inline-flex min-h-11 min-w-[2.75rem] shrink-0 items-center justify-center rounded-lg px-2 py-2 text-[#f2ebe3]/72 transition active:bg-white/5 hover:text-[#faf6ee] [-webkit-tap-highlight-color:transparent] sm:px-2.5"
            >
              Realizacje
            </Link>
            <Link
              href="/#opinie"
              className="touch-manipulation inline-flex min-h-11 min-w-[2.75rem] shrink-0 items-center justify-center rounded-lg px-2 py-2 text-[#f2ebe3]/72 transition active:bg-white/5 hover:text-[#faf6ee] [-webkit-tap-highlight-color:transparent] sm:px-2.5"
            >
              Opinie
            </Link>
          </div>
          <details className="relative z-[70] shrink-0">
            <summary className="touch-manipulation inline-flex min-h-11 cursor-pointer list-none items-center rounded-lg px-2 py-2 text-[#f2ebe3]/72 transition active:bg-white/5 hover:text-[#faf6ee] [-webkit-tap-highlight-color:transparent] sm:px-2.5 [&::-webkit-details-marker]:hidden">
              Oferta
            </summary>
            <div className="absolute right-0 top-full z-[80] mt-1 min-w-[11.5rem] rounded-xl border border-white/10 bg-[#1f1b17]/96 py-2 text-left shadow-xl backdrop-blur-xl">
              <Link
                href="/oferta#cennik"
                className="block px-4 py-2.5 text-sm text-[#f2ebe3]/88 hover:bg-white/5 hover:text-[#faf6ee]"
              >
                Cennik
              </Link>
              <Link
                href="/oferta#uslugi"
                className="block px-4 py-2.5 text-sm text-[#f2ebe3]/88 hover:bg-white/5 hover:text-[#faf6ee]"
              >
                Usługi
              </Link>
              <Link
                href="/oferta#co-dostajesz"
                className="block px-4 py-2.5 text-sm text-[#f2ebe3]/88 hover:bg-white/5 hover:text-[#faf6ee]"
              >
                Co dostajesz
              </Link>
              <Link
                href="/oferta#wspolpraca"
                className="block px-4 py-2.5 text-sm text-[#f2ebe3]/88 hover:bg-white/5 hover:text-[#faf6ee]"
              >
                Współpraca
              </Link>
              <Link
                href="/oferta#sla"
                className="block px-4 py-2.5 text-sm text-[#f2ebe3]/88 hover:bg-white/5 hover:text-[#faf6ee]"
              >
                SLA
              </Link>
              <Link
                href="/oferta#faq"
                className="block px-4 py-2.5 text-sm text-[#f2ebe3]/88 hover:bg-white/5 hover:text-[#faf6ee]"
              >
                FAQ
              </Link>
              <Link
                href="/oferta"
                className="block border-t border-white/10 px-4 py-2.5 text-sm font-medium text-[#f0d9a8] hover:bg-white/5"
              >
                Cała oferta
              </Link>
            </div>
          </details>
          <div className="flex shrink-0 flex-nowrap items-center gap-x-0.5 sm:gap-x-1 md:gap-x-2">
          <Link
            href="/#kontakt"
            className="touch-manipulation inline-flex min-h-11 min-w-[2.75rem] shrink-0 items-center justify-center rounded-lg px-2 py-2 text-[#f2ebe3]/72 transition active:bg-white/5 hover:text-[#faf6ee] [-webkit-tap-highlight-color:transparent] sm:px-2.5"
          >
            Kontakt
          </Link>
          <Link
            href="/polityka-prywatnosci"
            className="touch-manipulation inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-2 py-2 text-[#f2ebe3]/55 transition active:bg-white/5 hover:text-[#f2ebe3]/85 [-webkit-tap-highlight-color:transparent] sm:px-2.5"
          >
            RODO
          </Link>
          <Link
            href="/zloz-zapytanie"
            className="touch-manipulation inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-2 py-2 font-medium text-[#f0d9a8] transition active:bg-white/5 hover:text-[#faf0dc] [-webkit-tap-highlight-color:transparent] sm:px-2.5"
          >
            Złóż zapytanie
          </Link>
          <Link
            href="/admin/login"
            className="touch-manipulation inline-flex min-h-11 min-w-[2.75rem] shrink-0 items-center justify-center rounded-lg px-2 py-2 text-[#f2ebe3]/42 transition active:bg-white/5 hover:text-[#f2ebe3]/68 [-webkit-tap-highlight-color:transparent] sm:px-2.5"
          >
            Panel
          </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
