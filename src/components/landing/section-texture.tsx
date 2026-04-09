type SectionTextureProps = {
  variant: "paper" | "pattern";
};

/**
 * Tekstura sekcji (pergamin / wzór) — widoczna, ale stonowana.
 * Wcześniej gradient z ~55–72% krycia kładł się NA teksturze i całkowicie ją maskował.
 */
export function SectionTexture({ variant }: SectionTextureProps) {
  const src = variant === "paper" ? "/images/bg-paper.png" : "/images/bg-pattern.png";
  const tintClass =
    variant === "paper"
      ? "from-[var(--w-cream-b)]/20 via-transparent to-[var(--w-beige-a)]/22"
      : "from-[#faf8f4]/18 via-[var(--w-cream-b)]/12 to-[var(--w-beige-b)]/20";

  const opacityClass =
    variant === "paper"
      ? "opacity-[0.3] sm:opacity-[0.35]"
      : "opacity-[0.26] sm:opacity-[0.3]";

  return (
    <>
      <div
        className={`pointer-events-none absolute inset-0 z-0 bg-cover bg-center ${opacityClass}`}
        style={{ backgroundImage: `url(${src})` }}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-b ${tintClass}`}
        aria-hidden
      />
    </>
  );
}
