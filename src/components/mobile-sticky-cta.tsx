"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileStickyCta() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="pointer-events-auto mx-auto flex max-w-md justify-center px-4">
        <Link href="/zloz-zapytanie" className="btn-primary w-full max-w-sm shadow-lg shadow-black/25">
          Wyceń stronę
        </Link>
      </div>
    </div>
  );
}
