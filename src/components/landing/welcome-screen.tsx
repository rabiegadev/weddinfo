import Image from "next/image";
import Link from "next/link";
import { GoldFlourishDivider } from "@/components/landing/gold-flourish-divider";
import { WelcomeAnimatedFeatures } from "@/components/landing/welcome-animated-features";
import { WedinfoLogo } from "@/components/wedinfo-logo";

/**
 * Dwa pełne ekrany: zdjęcie (bukiet), potem animowane ikony funkcji wizytówki.
 */
export function WelcomeScreen() {
  return (
    <div className="welcome-landing">
      {/* Ekran 1 — klimat rustykalny / złoto słomy i krem róży */}
      <section
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-16"
        aria-label="Powitanie"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src="/images/welcome-bouquet-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_52%] scale-105 brightness-[1.03] contrast-[1.02] saturate-[1.08]"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#faf6ee]/92 via-[#faf6ee]/25 to-[#3d3429]/20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-[0.18]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 85%, rgba(62,48,32,0.55), transparent 55%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 30%, rgba(201, 162, 106, 0.2), transparent 50%), radial-gradient(ellipse 55% 40% at 85% 25%, rgba(221, 188, 140, 0.14), transparent 45%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-lg rounded-[2rem] border border-white/70 bg-[#faf6ee]/88 px-8 py-10 text-center shadow-[0_20px_50px_rgba(45,38,32,0.12)] backdrop-blur-md sm:px-10 sm:py-11">
          <WedinfoLogo variant="brand" size="hero" />
          <GoldFlourishDivider className="mx-auto mt-8 w-[min(100%,20rem)]" />
          <p className="font-wedinfo-serif mt-6 text-xl font-medium leading-snug text-[var(--w-gold-deep)] sm:text-2xl">
            Wizytówki weselne z sercem
          </p>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-[var(--foreground)]/82 sm:text-base">
            Harmonogram ślubu i wesela, wskazówki dojazdu oraz zaproszenie do
            potwierdzenia obecności — w jednej, klarownej stronie zamiast
            rozproszonej korespondencji. Klasyczna treść w nowoczesnej, łatwej do
            udostępnienia formie.
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--w-gold-deep)]">
            Dalej
          </span>
          <span
            className="flex h-9 w-5 justify-center rounded-full border border-[var(--w-gold-deep)]/35 bg-white/80 shadow-sm"
            aria-hidden
          >
            <span className="mt-1.5 block size-1.5 animate-bounce rounded-full bg-[var(--w-gold-deep)]/55" />
          </span>
          <div className="flex flex-col gap-1.5 text-xs">
            <Link
              href="#wizytowka-wesela"
              className="font-medium text-[var(--foreground)]/75 underline-offset-4 hover:text-[var(--w-gold-deep)] hover:underline"
            >
              Zobacz skład wizytówki
            </Link>
            <Link
              href="#glowna-tresc"
              className="text-[var(--foreground)]/55 underline-offset-4 hover:text-[var(--w-gold-deep)] hover:underline"
            >
              Pomiń powitanie
            </Link>
          </div>
        </div>
      </section>

      {/* Ekran 2 — animacje: harmonogram, dojazd, RSVP */}
      <section
        id="wizytowka-wesela"
        className="relative min-h-dvh scroll-mt-4 border-t border-[var(--w-gold-deep)]/10 bg-gradient-to-b from-[#f2ebe2] via-[#faf6ee] to-[#f7f2eb]"
        aria-label="Skład wizytówki weselnej"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <WelcomeAnimatedFeatures />
        <p className="relative z-10 pb-14 text-center">
          <Link
            href="#glowna-tresc"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--w-gold-deep)] underline-offset-4 hover:underline"
          >
            Przejdź do treści strony
            <span aria-hidden>↓</span>
          </Link>
        </p>
      </section>
    </div>
  );
}
