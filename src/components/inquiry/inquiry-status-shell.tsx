import Link from "next/link";
import type { ReactNode } from "react";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";
import { SubpageHero } from "@/components/subpage-hero";

type InquiryStatusShellProps = {
  title: string;
  subtitle: string;
  backHref?: string;
  backLabel?: string;
  /** Wąski układ dla formularza logowania; szeroki dla podglądu zgłoszenia. */
  width?: "narrow" | "wide";
  children: ReactNode;
};

export function InquiryStatusShell({
  title,
  subtitle,
  backHref = "/kontakt",
  backLabel = "Formularze kontaktowe",
  width = "wide",
  children,
}: InquiryStatusShellProps) {
  const contentMax = width === "narrow" ? "max-w-2xl" : "max-w-5xl";

  return (
    <div className="flex flex-1 flex-col pb-24 md:pb-0">
      <SubpageHero>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)] sm:mt-8">
          Status zgłoszenia
        </p>
        <h1 className="font-wedinfo-serif mt-4 text-3xl font-medium sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">{subtitle}</p>
      </SubpageHero>

      <section className="bg-white py-10 sm:py-16 lg:py-20">
        <LandingSectionInner className={`mx-auto ${contentMax}`}>
          <p className="mb-6 text-center text-sm sm:mb-8">
            <Link
              href={backHref}
              className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--gold)] transition-opacity hover:opacity-80"
            >
              ← {backLabel}
            </Link>
          </p>
          <div className="border border-[var(--border-light)] bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-8 lg:p-10">
            {children}
          </div>
        </LandingSectionInner>
      </section>
    </div>
  );
}
