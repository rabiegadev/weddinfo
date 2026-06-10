import Image from "next/image";
import Link from "next/link";
import type { PortfolioExample } from "@/data/portfolio-examples";

type PortfolioExampleCardProps = {
  item: PortfolioExample;
  featured?: boolean;
};

export function PortfolioExampleCard({ item, featured = false }: PortfolioExampleCardProps) {
  const badge = item.badge ?? "demo";
  const isLive = badge === "live";

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden border bg-white transition ${
        featured
          ? "border-[var(--gold)]/50 shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
          : "border-[var(--border-light)] shadow-[0_8px_28px_rgba(0,0,0,0.04)] hover:border-[var(--gold)]/40"
      }`}
    >
      {item.screenshotSrc ? (
        item.liveUrl ? (
          <Link
            href={item.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block h-52 w-full overflow-hidden sm:h-56"
            aria-label={`Otwórz stronę: ${item.couple}`}
          >
            <Image
              src={item.screenshotSrc}
              alt={`Wizytówka weselna — ${item.couple}`}
              fill
              className="object-cover object-top transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={isLive}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          </Link>
        ) : (
          <div className="relative h-52 w-full overflow-hidden sm:h-56">
            <Image
              src={item.screenshotSrc}
              alt={`Wizytówka weselna — ${item.couple}`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )
      ) : (
        <div className={`relative h-44 bg-gradient-to-br ${item.palette} px-5 pt-6`}>
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
          <div className="relative flex items-start justify-between gap-2">
            <div>
              <p className={`font-wedinfo-serif text-lg font-medium ${item.accent}`}>{item.couple}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {item.date}
              </p>
            </div>
            <span className="rounded-none border border-[var(--border-light)] bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Wkrótce
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              {item.urlDisplay ?? `${item.slug}.weddinfo.pl`}
            </p>
            <p className="font-wedinfo-serif mt-2 text-xl text-[var(--text-dark)]">{item.couple}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">{item.date}</p>
          </div>
          <span
            className={`shrink-0 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              isLive
                ? "bg-[var(--gold)] text-white"
                : "border border-[var(--border-light)] text-[var(--text-muted)]"
            }`}
          >
            {isLive ? "Na żywo" : "Demo"}
          </span>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
          {item.summary ??
            "Spersonalizowane kolory, sekcja RSVP i harmonogram dnia — wszystko w jednej, lekkiej stronie."}
        </p>

        <div className="border-t border-[var(--border-light)] pt-4">
          {item.liveUrl ? (
            <Link
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--gold)] transition-opacity hover:opacity-80"
            >
              Otwórz stronę
              <span aria-hidden>↗</span>
            </Link>
          ) : (
            <span className="text-sm text-[var(--text-muted)]">Podgląd w przygotowaniu</span>
          )}
        </div>
      </div>
    </article>
  );
}
