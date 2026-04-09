"use client";

import { useEffect, useState } from "react";

/**
 * Dwa abstrakcyjne tła (paleta A vs B), płynne przejście w miarę przewijania.
 */
export function ScrollBackdrop() {
  const [blend, setBlend] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const start = 40;
      const range = Math.min(520, typeof window !== "undefined" ? window.innerHeight * 0.65 : 520);
      const y = window.scrollY;
      const t = Math.min(1, Math.max(0, (y - start) / range));
      setBlend(t);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const aOpacity = 1 - blend;
  const bOpacity = blend;

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* Warstwa A — krem / złoto / beż (paleta 1) */}
      <div
        className="absolute inset-0 transition-[opacity] duration-700 ease-out"
        style={{ opacity: aOpacity }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 10% 20%, rgba(229, 193, 143, 0.38), transparent 55%),
              radial-gradient(ellipse 90% 70% at 90% 30%, rgba(237, 230, 217, 0.85), transparent 50%),
              radial-gradient(ellipse 80% 60% at 50% 100%, rgba(232, 212, 200, 0.45), transparent 55%),
              linear-gradient(165deg, #faf6ee 0%, #ffffff 40%, #faf7f2 100%)
            `,
          }}
        />
        <div
          className="absolute -left-[20%] top-1/4 h-[min(80vw,520px)] w-[min(80vw,520px)] rounded-full opacity-[0.35] blur-[100px]"
          style={{ background: "var(--w-gold-soft-a)" }}
        />
        <div
          className="absolute -right-[15%] bottom-[10%] h-[min(70vw,480px)] w-[min(70vw,480px)] rounded-full opacity-[0.28] blur-[90px]"
          style={{ background: "var(--w-beige-a)" }}
        />
      </div>

      {/* Warstwa B — róż puder / mauve / złoto piaskowe (paleta 2) */}
      <div
        className="absolute inset-0 transition-[opacity] duration-700 ease-out"
        style={{ opacity: bOpacity }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 100% 75% at 85% 15%, rgba(239, 212, 217, 0.55), transparent 52%),
              radial-gradient(ellipse 70% 55% at 15% 60%, rgba(201, 168, 185, 0.22), transparent 48%),
              radial-gradient(ellipse 90% 50% at 50% 110%, rgba(217, 184, 138, 0.25), transparent 50%),
              linear-gradient(170deg, #faf7f2 0%, #ede4e0 35%, #faf6ee 100%)
            `,
          }}
        />
        <div
          className="absolute left-1/3 top-0 h-[min(100vw,600px)] w-[min(100vw,600px)] -translate-x-1/2 rounded-full opacity-[0.22] blur-[110px]"
          style={{ background: "var(--w-mauve)" }}
        />
        <div
          className="absolute right-0 top-1/2 h-[min(85vw,440px)] w-[min(85vw,440px)] translate-x-1/3 rounded-full opacity-[0.3] blur-[95px]"
          style={{ background: "var(--w-blush-b)" }}
        />
      </div>

      {/* Wspólna delikatna tekstura szumu */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
