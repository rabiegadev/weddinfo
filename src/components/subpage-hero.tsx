import type { ReactNode } from "react";
import { HeroBackdrop } from "@/components/landing/hero-backdrop";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";

type SubpageHeroProps = {
  children: ReactNode;
  innerClassName?: string;
};

export function SubpageHero({ children, innerClassName = "pb-14 text-center sm:pb-16 lg:pb-20" }: SubpageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <HeroBackdrop />
      <LandingSectionInner
        className={`relative z-10 pt-[max(1rem,env(safe-area-inset-top))] ${innerClassName}`}
      >
        <LandingNav variant="hero" />
        {children}
      </LandingSectionInner>
    </section>
  );
}
