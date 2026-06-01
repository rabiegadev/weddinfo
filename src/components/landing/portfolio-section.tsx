import Image from "next/image";
import Link from "next/link";
import { landingPortfolioFeatured } from "@/data/landing-portfolio";
import { LandingSectionInner } from "./landing-section-inner";

export function PortfolioSection() {
  return (
    <section
      id="realizacje"
      className="scroll-mt-header bg-[var(--bg-dark)] pt-16 pb-12 sm:pt-24 sm:pb-14"
      aria-labelledby="portfolio-heading"
    >
      <LandingSectionInner>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)] sm:text-sm">
          Portfolio
        </p>
        <h2
          id="portfolio-heading"
          className="font-wedinfo-serif mt-2 text-left text-3xl font-medium text-white sm:mt-3 sm:text-4xl"
        >
          Zobacz nasze realizacje
        </h2>
        <p className="mt-4 max-w-2xl text-left text-sm leading-relaxed text-white/65 sm:text-base">
          Spójne wizytówki w dopasowanej kolorystyce — harmonogram, RSVP, dojazd i galeria w jednym
          miejscu.
        </p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {landingPortfolioFeatured.map((item) => (
            <li key={item.couple}>
              <article className="group relative overflow-hidden bg-[#1a1a1a]">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={item.imageSrc}
                    alt={`Realizacja — ${item.couple}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                  <p className="font-wedinfo-serif text-lg text-white">{item.couple}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                    {item.style}
                  </p>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--gold)] transition hover:text-white"
                  >
                    Zobacz
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <Link href="/realizacje" className="btn-secondary">
            Zobacz wszystkie realizacje
          </Link>
        </div>
      </LandingSectionInner>
    </section>
  );
}
