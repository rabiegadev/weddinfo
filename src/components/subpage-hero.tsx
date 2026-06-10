import Image from "next/image";
import type { ReactNode } from "react";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";

const HERO_IMAGE = "/images/para8.jpg";

const HERO_GRADIENT = `
  linear-gradient(
    100deg,
    rgba(0, 0, 0, 0.88) 0%,
    rgba(0, 0, 0, 0.78) 22%,
    rgba(0, 0, 0, 0.58) 45%,
    rgba(0, 0, 0, 0.35) 68%,
    rgba(0, 0, 0, 0.18) 100%
  )
`;

type SubpageHeroProps = {
  children: ReactNode;
  innerClassName?: string;
};

export function SubpageHero({ children, innerClassName = "pb-14 text-center sm:pb-16 lg:pb-20" }: SubpageHeroProps) {
  return (
    <section className="relative overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0" style={{ background: HERO_GRADIENT }} />
      </div>
      <LandingSectionInner
        className={`relative z-10 pt-[max(1rem,env(safe-area-inset-top))] ${innerClassName}`}
      >
        <LandingNav variant="hero" />
        {children}
      </LandingSectionInner>
    </section>
  );
}
