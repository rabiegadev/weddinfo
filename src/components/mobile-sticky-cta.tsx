"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Stały przycisk CTA na mobile na stronie głównej (nad treścią stopki). */
export function MobileStickyCta() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="pointer-events-auto mx-auto flex max-w-md justify-center px-4">
        <Link
          href="/zloz-zapytanie"
          className="touch-manipulation inline-flex min-h-12 w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-r from-[var(--w-gold-deep)] to-[var(--w-gold-soft-b)] px-6 text-base font-semibold text-white shadow-lg shadow-[#1a1208]/35 [-webkit-tap-highlight-color:transparent]"
        >
          Złóż zapytanie
        </Link>
      </div>
    </div>
  );
}
