"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const items: readonly { href: string; label: string; highlight?: boolean }[] = [
  { href: "/oferta#cennik", label: "Cennik" },
  { href: "/oferta#uslugi", label: "Usługi" },
  { href: "/oferta#co-dostajesz", label: "Co dostajesz" },
  { href: "/oferta#wspolpraca", label: "Współpraca" },
  { href: "/oferta#sla", label: "SLA" },
  { href: "/oferta#faq", label: "FAQ" },
  { href: "/oferta", label: "Cała oferta", highlight: true },
];

function useHoverMenuCapable() {
  const [capable, setCapable] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (min-width: 768px)");
    const sync = () => setCapable(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return capable;
}

export function OfferMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hoverMenu = useHoverMenuCapable();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open, close]);

  return (
    <div
      ref={rootRef}
      className="relative z-[70] shrink-0"
      onMouseEnter={() => {
        if (hoverMenu) setOpen(true);
      }}
      onMouseLeave={() => {
        if (hoverMenu) setOpen(false);
      }}
    >
      <button
        type="button"
        className={`touch-manipulation inline-flex min-h-11 cursor-pointer list-none items-center rounded-lg px-2 py-2 transition active:bg-white/5 sm:px-2.5 ${
          open
            ? "text-[#f0d9a8] hover:text-[#faf0dc]"
            : "text-[#f2ebe3]/72 hover:text-[#faf6ee]"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => {
          if (!hoverMenu) setOpen((o) => !o);
        }}
      >
        Oferta
      </button>
      {/* mt-* między triggerem a panelem = martwa strefa: mouseleave zamyka menu zanim kursor dojdzie do linków. Mostek + panel w jednym kolumnie flex — hover jest ciągły. */}
      <div
        className={`absolute right-0 top-full z-[80] flex min-w-[11.5rem] flex-col items-stretch transition-[opacity,visibility] duration-150 ${
          open ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        } `}
      >
        <div className="h-2 shrink-0 bg-transparent" aria-hidden />
        <div
          className="rounded-xl border border-white/10 bg-[#1f1b17]/96 py-2 text-left shadow-xl backdrop-blur-xl"
          role="menu"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className={
                item.highlight
                  ? "block border-t border-white/10 px-4 py-2.5 text-sm font-medium text-[#f0d9a8] hover:bg-white/5"
                  : "block px-4 py-2.5 text-sm text-[#f2ebe3]/88 hover:bg-white/5 hover:text-[#faf6ee]"
              }
              onClick={() => close()}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
