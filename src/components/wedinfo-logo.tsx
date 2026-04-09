"use client";

import { useId, type SVGProps } from "react";

export type WedinfoLogoSize = "sm" | "md" | "lg" | "hero";

type LogoProps = {
  variant?: "brand" | "light";
  markOnly?: boolean;
  size?: WedinfoLogoSize;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, "children">;

const sizeClasses: Record<WedinfoLogoSize, { mark: string; text: string }> = {
  sm: { mark: "h-8 w-8", text: "text-base sm:text-lg" },
  md: { mark: "h-10 w-10 sm:h-11 sm:w-11", text: "text-lg sm:text-xl" },
  lg: { mark: "h-14 w-14 sm:h-16 sm:w-16", text: "text-2xl sm:text-3xl" },
  hero: {
    mark: "h-[4.5rem] w-[4.5rem] sm:h-[5.5rem] sm:w-[5.5rem] md:h-28 md:w-28",
    text: "text-4xl sm:text-5xl md:text-6xl tracking-tight",
  },
};

export function WedinfoLogoMark({
  variant = "brand",
  className = "",
  size = "md",
  ...svgProps
}: Omit<LogoProps, "markOnly"> & { size?: WedinfoLogoSize }) {
  const isLight = variant === "light";
  const gid = useId().replace(/:/g, "");
  const gradRing = `wedinfo-ring-${gid}`;
  const gradShine = `wedinfo-shine-${gid}`;
  const s = sizeClasses[size];

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${s.mark} ${className}`}
      aria-hidden
      {...svgProps}
    >
      <defs>
        <linearGradient id={gradRing} x1="8" y1="10" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor={isLight ? "#f5e6d3" : "var(--w-gold-deep)"} />
          <stop offset="0.45" stopColor={isLight ? "#faf0e4" : "var(--w-gold-shine)"} />
          <stop offset="1" stopColor={isLight ? "#e8d4c8" : "var(--w-gold-soft-b)"} />
        </linearGradient>
        <linearGradient id={gradShine} x1="22" y1="6" x2="30" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor={isLight ? "#fde8ef" : "var(--w-blush-b)"} stopOpacity={isLight ? 0.9 : 0.95} />
          <stop offset="1" stopColor={isLight ? "#f5d0dc" : "var(--w-pink-dust)"} stopOpacity={0.75} />
        </linearGradient>
      </defs>
      {isLight ? (
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(229,193,143,0.35)"
          strokeWidth="1"
        />
      ) : (
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          fill="rgba(255,255,255,0.72)"
          stroke="rgba(191,164,111,0.45)"
          strokeWidth="1"
        />
      )}
      <circle
        cx="19.5"
        cy="26"
        r="9"
        stroke={`url(#${gradRing})`}
        strokeWidth="1.35"
        fill="none"
      />
      <circle
        cx="28.5"
        cy="26"
        r="9"
        stroke={`url(#${gradRing})`}
        strokeWidth="1.35"
        fill="none"
        opacity={isLight ? 0.92 : 0.98}
      />
      <path
        d="M24 10c-1.4 3.4-4.5 5.6-7.4 6.8 1 .4 2 1.2 2.6 2.2 1.1-1.4 3.1-3 5.1-3.4z"
        fill={`url(#${gradShine})`}
      />
    </svg>
  );
}

export function WedinfoLogo({
  variant = "brand",
  markOnly = false,
  size = "md",
  className = "",
  ...svgProps
}: LogoProps) {
  const isLight = variant === "light";
  const s = sizeClasses[size];
  const textClass =
    variant === "light"
      ? `font-wedinfo-serif font-semibold ${s.text} text-[#faf6ee]`
      : `font-wedinfo-serif font-semibold ${s.text} text-gold-metallic`;

  const layout =
    size === "hero" ? "flex flex-col items-center gap-4 sm:gap-5" : "inline-flex items-center gap-2.5 sm:gap-3";

  return (
    <span className={`${layout} ${className}`}>
      <WedinfoLogoMark variant={variant} size={size} {...svgProps} />
      {!markOnly ? <span className={textClass}>Weddinfo</span> : null}
    </span>
  );
}
