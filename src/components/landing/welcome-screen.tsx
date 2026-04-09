import Image from "next/image";
import { GoldFlourishDivider } from "@/components/landing/gold-flourish-divider";
import { WelcomeScrollChevron } from "@/components/landing/welcome-scroll-chevron";
import { WedinfoLogo } from "@/components/wedinfo-logo";

/** Jedna plansza powitalna: zdjęcie, karta z treścią, strzałka w dół. */
export function WelcomeScreen() {
  return (
    <div className="welcome-landing">
      <section
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-x-clip overflow-y-hidden px-3 py-12 pt-[max(3rem,env(safe-area-inset-top,0px))] sm:px-4 sm:py-16"
        aria-label="Powitanie"
      >
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
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
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#faf6ee]/88 via-[#faf6ee]/22 to-[#3d3429]/22"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] mix-blend-multiply opacity-[0.2]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 85%, rgba(62,48,32,0.55), transparent 55%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.38]"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 30%, rgba(201, 162, 106, 0.2), transparent 50%), radial-gradient(ellipse 55% 40% at 85% 25%, rgba(221, 188, 140, 0.14), transparent 45%)",
          }}
          aria-hidden
        />

        {/* Karta: ciemne tło pod złote logo (jak w załączonym brandingu) */}
        <div className="relative z-10 mx-auto w-full max-w-lg rounded-[1.75rem] border border-[#c9a86a]/28 bg-gradient-to-br from-[#141210]/94 via-[#1f1b17]/96 to-[#12100e]/95 px-5 py-8 text-center shadow-[0_24px_56px_rgba(0,0,0,0.45)] ring-1 ring-[#f0d9a8]/10 sm:rounded-[2rem] sm:px-10 sm:py-11">
          <div
            className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 85% 70% at 50% 35%, rgba(201, 168, 106, 0.12), transparent 55%)",
            }}
            aria-hidden
          />
          <div className="relative">
            <WedinfoLogo size="hero" priority />
            <GoldFlourishDivider className="mx-auto mt-8 w-[min(100%,20rem)] text-[#d4b87a]/85" />
            <p className="mt-6 text-xs font-medium uppercase tracking-[0.28em] text-[#d4c9b4]/95 sm:text-sm">
              Wizytówka Twojego wesela
            </p>
            <p className="mt-5 text-pretty text-sm leading-relaxed text-[#ebe4d8]/92 sm:text-base">
              Harmonogram ślubu i wesela, wskazówki dojazdu oraz zaproszenie do potwierdzenia obecności —
              wszystko w jednym miejscu.
            </p>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-[#ebe4d8]/88 sm:text-base">
              Zamiast wielu wiadomości i telefonów, daj swoim gościom jedną, piękną stronę ze wszystkimi
              szczegółami Waszego Dnia.
            </p>
          </div>
        </div>

        <WelcomeScrollChevron />
      </section>
    </div>
  );
}
