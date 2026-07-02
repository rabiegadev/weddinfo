"use client";

import { useEffect, useRef, useState } from "react";
import { PricingCardsGrid } from "@/components/pricing/pricing-sections";
import { pricingPlans } from "@/data/pricing-plans";
import { LandingSectionInner } from "./landing-section-inner";

export function PricingSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { rootMargin: "-8% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id="cennik"
      className={`scroll-mt-header relative z-[2] bg-white py-14 sm:py-20 ${visible ? "pricing-visible" : ""}`}
      aria-labelledby="pricing-heading"
    >
      <LandingSectionInner className="relative z-[2]">
        <h2
          id="pricing-heading"
          className="font-wedinfo-serif text-left text-3xl font-medium text-[var(--text-dark)] sm:text-4xl"
        >
          Cennik
        </h2>

        <div className="mt-12">
          <PricingCardsGrid plans={pricingPlans} animated />
        </div>
      </LandingSectionInner>
    </section>
  );
}
