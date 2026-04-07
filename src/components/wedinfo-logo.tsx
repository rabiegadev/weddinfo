"use client";

import { useId, type SVGProps } from "react";

type LogoProps = {
  variant?: "brand" | "light";
  markOnly?: boolean;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, "children">;

export function WedinfoLogoMark({
  variant = "brand",
  className = "",
  ...svgProps
}: Omit<LogoProps, "markOnly">) {
  const isLight = variant === "light";
  const gid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden
      {...svgProps}
    >
      <defs>
        <linearGradient
          id={`wedinfo-logo-bg-${gid}`}
          x1="8"
          y1="4"
          x2="36"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#881337" />
          <stop offset="1" stopColor="#be123c" />
        </linearGradient>
      </defs>
      {isLight ? (
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="10"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(254,205,211,0.35)"
          strokeWidth="1"
        />
      ) : (
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="10"
          fill={`url(#wedinfo-logo-bg-${gid})`}
        />
      )}
      <circle
        cx="16.5"
        cy="19"
        r="5.5"
        stroke={isLight ? "#fecdd3" : "#fff"}
        strokeOpacity={isLight ? 0.95 : 1}
        strokeWidth="1.35"
        fill="none"
      />
      <circle
        cx="23.5"
        cy="19"
        r="5.5"
        stroke={isLight ? "#fda4af" : "#fff"}
        strokeOpacity={isLight ? 0.85 : 0.95}
        strokeWidth="1.35"
        fill="none"
      />
      <path
        d="M20 8.5c-1.2 2.8-3.8 4.5-6.2 5.2.8.3 1.6.9 2.1 1.8.9-1.1 2.5-2.4 4.1-2.7z"
        fill={isLight ? "#fb7185" : "#ffe4e6"}
        fillOpacity={isLight ? 0.75 : 0.95}
      />
    </svg>
  );
}

export function WedinfoLogo({
  variant = "brand",
  markOnly = false,
  className = "",
  ...svgProps
}: LogoProps) {
  const textClass =
    variant === "light"
      ? "font-semibold tracking-tight text-white"
      : "font-semibold tracking-tight text-rose-950";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <WedinfoLogoMark variant={variant} className="h-9 w-9 sm:h-10 sm:w-10" {...svgProps} />
      {!markOnly ? <span className={`text-lg sm:text-xl ${textClass}`}>Wedinfo</span> : null}
    </span>
  );
}
