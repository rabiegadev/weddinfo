import Image from "next/image";
import type { PortfolioExample } from "@/data/portfolio-examples";

type PortfolioCardPreviewProps = {
  item: PortfolioExample;
  /** Wariant na ciemnym tle landing page */
  variant?: "dark" | "light";
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function PortfolioCardPreview({
  item,
  variant = "dark",
  className = "",
  imageClassName = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
}: PortfolioCardPreviewProps) {
  if (item.previewHidden) {
    return (
      <div className={`relative overflow-hidden ${className}`} aria-hidden>
        <div className={`absolute inset-0 scale-110 bg-gradient-to-br ${item.palette} blur-2xl opacity-40`} />
        <div
          className={`absolute inset-0 ${
            variant === "dark" ? "bg-[#141414]/85 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl"
          }`}
        />
        <p
          className={`absolute inset-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-[0.22em] ${
            variant === "dark" ? "text-white/25" : "text-[var(--text-muted)]/50"
          }`}
        >
          Wkrótce
        </p>
      </div>
    );
  }

  if (item.screenshotSrc) {
    return (
      <Image
        src={item.screenshotSrc}
        alt={`Przykład projektu — ${item.couple}`}
        fill
        priority={priority}
        sizes={sizes}
        className={imageClassName}
      />
    );
  }

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${item.palette} px-5 pt-6 ${className}`}>
      <p className={`font-wedinfo-serif text-lg font-medium ${item.accent}`}>{item.couple}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {item.date}
      </p>
    </div>
  );
}
