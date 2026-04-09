"use client";

import Image from "next/image";
import { Great_Vibes } from "next/font/google";

export type WedinfoLogoSize = "sm" | "md" | "lg" | "hero";

type LogoProps = {
  variant?: "brand" | "light" | "welcome";
  markOnly?: boolean;
  size?: WedinfoLogoSize;
  className?: string;
  priority?: boolean;
};

const weddinfoWordmark = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const ICON_SRC = "/images/weddinfo-icon-couple.png";
/** Proporcje ikony (dopasuj po wymianie PNG). */
const ICON_W = 280;
const ICON_H = 360;

const rowLayout: Record<WedinfoLogoSize, string> = {
  sm: "flex-row items-center gap-2",
  md: "flex-row items-center gap-2.5 sm:gap-3",
  lg: "flex-row items-center gap-3 sm:gap-3.5",
  hero: "flex-col items-center gap-4 sm:gap-5",
};

const iconClass: Record<WedinfoLogoSize, string> = {
  sm: "h-8 w-auto",
  md: "h-9 w-auto sm:h-10",
  lg: "h-11 w-auto sm:h-12 md:h-14",
  hero: "h-[5.25rem] w-auto sm:h-32 md:h-[8.5rem]",
};

const wordClass: Record<WedinfoLogoSize, string> = {
  sm: "text-[1.65rem] leading-none sm:text-[1.85rem]",
  md: "text-[1.85rem] leading-none sm:text-[2.15rem]",
  lg: "text-[2.1rem] leading-none sm:text-[2.45rem] md:text-[2.65rem]",
  hero: "text-[2.75rem] leading-none sm:text-5xl md:text-6xl",
};

/**
 * Ikona pary (PNG) + napis „Weddinfo” w skrypcie Great Vibes.
 */
export function WedinfoLogo({
  variant = "brand",
  markOnly = false,
  size = "md",
  className = "",
  priority = false,
}: LogoProps) {
  const isLight = variant === "light";

  const textStyles = isLight
    ? "text-[#f5ebdc] [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]"
    : "text-gold-metallic";

  return (
    <span className={`inline-flex ${rowLayout[size]} ${className}`}>
      <Image
        src={ICON_SRC}
        alt={markOnly ? "Weddinfo" : ""}
        width={ICON_W}
        height={ICON_H}
        priority={priority}
        className={`shrink-0 object-contain object-bottom ${iconClass[size]}`}
        sizes={size === "hero" ? "(max-width: 768px) 40vw, 200px" : "80px"}
        aria-hidden={!markOnly}
      />
      {!markOnly ? (
        <span
          className={`${weddinfoWordmark.className} ${wordClass[size]} ${textStyles} select-none`}
        >
          Weddinfo
        </span>
      ) : null}
    </span>
  );
}
