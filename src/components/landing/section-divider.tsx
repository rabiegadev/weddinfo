"use client";

import { useId } from "react";

/**
 * Przerywnik sekcji: symetryczna winieta, obrączki w centrum, gradient.
 */
export function SectionDivider({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const strokeId = `section-divider-stroke-${uid}`;
  const leafId = `section-divider-leaf-${uid}`;

  return (
    <svg
      className={`mx-auto h-10 w-[min(100%,18rem)] text-rose-300 sm:h-11 sm:w-80 ${className}`}
      viewBox="0 0 320 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={strokeId} x1="0" y1="0" x2="320" y2="0">
          <stop stopColor="#fecdd3" stopOpacity="0.2" />
          <stop offset="0.42" stopColor="#fb7185" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#fbbf24" stopOpacity="0.55" />
          <stop offset="0.58" stopColor="#fb7185" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fecdd3" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={leafId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fda4af" />
          <stop offset="1" stopColor="#f9a8d4" />
        </linearGradient>
      </defs>

      {/* Lewa gałązka */}
      <path
        d="M8 22h52c12 0 18-4 24-10 2-2 4-3 6-2.5 1.2.4 1.8 2 1.2 3.2-.8 1.6-2.8 2.8-5 3.5-4 1.2-8.5 1-12-.5"
        stroke={`url(#${strokeId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M58 14c-4 2-6 6-5.5 9.5M46 18c-3 1.2-4.5 3.8-4 6.5M70 12c-2.5 3-2 7 .5 9"
        stroke={`url(#${strokeId})`}
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.65"
      />
      <ellipse
        cx="78"
        cy="13"
        rx="3.5"
        ry="5"
        transform="rotate(-28 78 13)"
        fill={`url(#${leafId})`}
        opacity="0.35"
      />

      {/* Prawa gałązka (lustrzana) */}
      <path
        d="M312 22h-52c-12 0-18-4-24-10-2-2-4-3-6-2.5-1.2.4-1.8 2-1.2 3.2.8 1.6 2.8 2.8 5 3.5 4 1.2 8.5 1 12-.5"
        stroke={`url(#${strokeId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M262 14c4 2 6 6 5.5 9.5M274 18c3 1.2 4.5 3.8 4 6.5M250 12c2.5 3 2 7-.5 9"
        stroke={`url(#${strokeId})`}
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.65"
      />
      <ellipse
        cx="242"
        cy="13"
        rx="3.5"
        ry="5"
        transform="rotate(28 242 13)"
        fill={`url(#${leafId})`}
        opacity="0.35"
      />

      {/* Środek — obrączki */}
      <circle
        cx="148"
        cy="22"
        r="7"
        stroke={`url(#${strokeId})`}
        strokeWidth="1.2"
        fill="none"
      />
      <circle
        cx="172"
        cy="22"
        r="7"
        stroke={`url(#${strokeId})`}
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="160" cy="22" r="1.4" fill="#fb7185" opacity="0.45" />
    </svg>
  );
}
