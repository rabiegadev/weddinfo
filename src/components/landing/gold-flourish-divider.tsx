"use client";

import { useId } from "react";

/**
 * Separator: cienkie złote odcinki, ornament w środku, spiczaste zakończenia.
 */
export function GoldFlourishDivider({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const gid = `gold-grad-${uid}`;

  return (
    <svg
      className={`mx-auto h-9 text-[var(--w-gold-deep)] sm:h-10 ${className}`}
      viewBox="0 0 400 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--w-gold-deep)" stopOpacity="0.2" />
          <stop offset="0.32" stopColor="var(--w-gold-deep)" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="var(--w-gold-shine)" stopOpacity="1" />
          <stop offset="0.68" stopColor="var(--w-gold-deep)" stopOpacity="0.85" />
          <stop offset="1" stopColor="var(--w-gold-deep)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Lewy „liść” na końcu + linia */}
      <path
        d="M10 18c2-3 6-3 8 0s-2 6-6 5"
        stroke={`url(#${gid})`}
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="22" y1="18" x2="168" y2="18" stroke={`url(#${gid})`} strokeWidth="0.85" strokeLinecap="round" />

      {/* Prawy koniec + linia */}
      <path
        d="M390 18c-2-3-6-3-8 0s2 6 6 5"
        stroke={`url(#${gid})`}
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="378" y1="18" x2="232" y2="18" stroke={`url(#${gid})`} strokeWidth="0.85" strokeLinecap="round" />

      {/* Środek — kółko i symetryczne płatki */}
      <circle cx="200" cy="18" r="2.4" fill={`url(#${gid})`} />
      <path
        d="M200 18l-5-5M200 18l5-5M200 18l-5 5M200 18l5 5"
        stroke={`url(#${gid})`}
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <ellipse cx="193" cy="18" rx="4" ry="2.5" transform="rotate(-35 193 18)" stroke={`url(#${gid})`} strokeWidth="0.55" fill="none" opacity="0.9" />
      <ellipse cx="207" cy="18" rx="4" ry="2.5" transform="rotate(35 207 18)" stroke={`url(#${gid})`} strokeWidth="0.55" fill="none" opacity="0.9" />
      <ellipse cx="193" cy="18" rx="4" ry="2.5" transform="rotate(35 193 18)" stroke={`url(#${gid})`} strokeWidth="0.55" fill="none" opacity="0.75" />
      <ellipse cx="207" cy="18" rx="4" ry="2.5" transform="rotate(-35 207 18)" stroke={`url(#${gid})`} strokeWidth="0.55" fill="none" opacity="0.75" />
    </svg>
  );
}
