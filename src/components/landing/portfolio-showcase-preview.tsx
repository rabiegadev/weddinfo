import Image from "next/image";
import type { PortfolioShowcaseSlide } from "@/data/portfolio-examples";

type PortfolioShowcasePreviewProps = {
  slides: readonly PortfolioShowcaseSlide[];
  couple: string;
  variant?: "dark" | "light";
  className?: string;
};

export function PortfolioShowcasePreview({
  slides,
  couple,
  variant = "dark",
  className = "",
}: PortfolioShowcasePreviewProps) {
  const previewSlides = slides.slice(0, 4);
  const borderClass =
    variant === "dark" ? "border-white/10" : "border-[var(--border-light)]";

  return (
    <div className={`grid h-full w-full grid-cols-2 grid-rows-2 gap-px bg-black/20 ${className}`}>
      {previewSlides.map((slide, index) => (
        <div key={slide.src} className={`relative min-h-0 overflow-hidden bg-[#1a1a1a] ${borderClass}`}>
          <Image
            src={slide.src}
            alt={`${couple} — ${slide.alt}`}
            fill
            sizes="(max-width: 640px) 25vw, 12vw"
            className="object-cover object-top"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
