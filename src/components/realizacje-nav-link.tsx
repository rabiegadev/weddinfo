"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

const RESET_MS = 3000;
const ADMIN_AFTER = 6;

/** Link do #realizacje; 6 szybkich kliknięć z rzędu (w oknie czasowym) otwiera logowanie admina. */
export function RealizacjeNavLink({ className }: { className?: string }) {
  const router = useRouter();
  const countRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <a
      href="/#realizacje"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        if (timerRef.current) clearTimeout(timerRef.current);
        countRef.current += 1;
        timerRef.current = setTimeout(() => {
          countRef.current = 0;
        }, RESET_MS);

        if (countRef.current >= ADMIN_AFTER) {
          countRef.current = 0;
          if (timerRef.current) clearTimeout(timerRef.current);
          router.push("/admin/login");
          return;
        }

        const el = document.getElementById("realizacje");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          router.push("/#realizacje");
        }
      }}
    >
      Realizacje
    </a>
  );
}
