import Image from "next/image";

export const HERO_IMAGE = "/images/para8.jpg";

export const HERO_GRADIENT = `
  linear-gradient(
    100deg,
    rgba(0, 0, 0, 0.82) 0%,
    rgba(0, 0, 0, 0.7) 24%,
    rgba(0, 0, 0, 0.48) 48%,
    rgba(0, 0, 0, 0.28) 72%,
    rgba(0, 0, 0, 0.12) 100%
  )
`;

type HeroBackdropProps = {
  className?: string;
};

/** Tło hero — CSS background jako niezawodna warstwa + Next Image dla preloadu/LCP. */
export function HeroBackdrop({ className = "" }: HeroBackdropProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute inset-0 bg-cover bg-[center_30%] bg-no-repeat"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-[center_30%] opacity-0"
        aria-hidden
      />
      <div className="absolute inset-0" style={{ background: HERO_GRADIENT }} />
    </div>
  );
}
