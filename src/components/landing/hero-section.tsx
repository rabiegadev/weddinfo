import Image from "next/image";
import Link from "next/link";
import { LandingNav } from "./landing-nav";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden"
      aria-label="Strona główna"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <Image
          src="/images/para8.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                100deg,
                rgba(0, 0, 0, 0.88) 0%,
                rgba(0, 0, 0, 0.78) 22%,
                rgba(0, 0, 0, 0.58) 45%,
                rgba(0, 0, 0, 0.35) 68%,
                rgba(0, 0, 0, 0.18) 100%
              )
            `,
          }}
        />
      </div>

      <div
        className="relative z-10 flex min-h-[100dvh] flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-16 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24"
      >
        <LandingNav variant="hero" />

        <div className="flex w-full max-w-3xl flex-1 flex-col items-start justify-center text-left lg:max-w-4xl">
          <h1 className="font-wedinfo-serif text-balance text-[2rem] font-medium leading-[1.12] tracking-tight sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem]">
            <span className="text-white">Wszystkie informacje </span>
            <span className="text-[var(--gold)]">o Waszym weselu</span>
            <span className="text-white"> w jednym miejscu</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/88 sm:text-lg">
            Plan dnia, dojazd, noclegi i potwierdzenie obecności w eleganckiej, czytelnej formie — bez
            dziesiątek wiadomości od gości.
          </p>
          <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link href="#realizacje" className="btn-primary w-full sm:w-auto sm:min-w-[220px]">
              Zobacz realizacje
            </Link>
            <Link href="/zloz-zapytanie" className="btn-secondary w-full sm:w-auto sm:min-w-[220px]">
              Wyceń stronę
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
