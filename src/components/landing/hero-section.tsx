import { HeroBackdrop } from "./hero-backdrop";
import { LandingNav } from "./landing-nav";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden"
      aria-label="Strona główna"
    >
      <HeroBackdrop />

      <div className="relative z-10 flex min-h-[100dvh] flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-16 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
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
          <a
            href="#korzysci"
            className="group mt-10 inline-flex flex-col items-start gap-3 text-white/80 transition-colors hover:text-white"
            aria-label="Dowiedz się więcej — przewiń w dół"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/90 group-hover:text-[var(--gold)]">
              Dowiedz się więcej
            </span>
            <span className="hero-scroll-arrow inline-flex text-[var(--gold)]" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" className="size-6" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
