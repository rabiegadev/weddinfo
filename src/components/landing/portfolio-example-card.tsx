import Image from "next/image";
import Link from "next/link";
import type { PortfolioExample } from "@/data/portfolio-examples";

export function PortfolioExampleCard({ item }: { item: PortfolioExample }) {
  const badge = item.badge ?? "demo";
  const isLive = badge === "live";

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--w-gold-deep)]/15 bg-white/70 shadow-sm shadow-[var(--w-gold-deep)]/8 transition hover:border-[var(--w-gold-deep)]/28 hover:shadow-md"
    >
      {item.screenshotSrc ? (
        item.liveUrl ? (
          <Link
            href={item.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block h-48 w-full overflow-hidden"
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
          </Link>
        ) : (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={item.screenshotSrc}
              alt={`Wizytówka weselna — ${item.couple}`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={isLive}
            />
          </div>
        )
      ) : (
        <div className={`relative h-36 bg-gradient-to-br ${item.palette} px-4 pt-6`}>
          <div className="absolute inset-0 bg-gradient-to-t from-white/45 to-transparent" />
          <div className="relative flex items-start justify-between gap-2">
            <div>
              <p className={`font-wedinfo-serif text-lg font-semibold italic ${item.accent}`}>
                {item.couple}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--foreground)]/50">
                {item.date}
              </p>
            </div>
            <span className="rounded-full bg-white/75 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--foreground)]/50 backdrop-blur-sm">
              Demo
            </span>
          </div>
          <div className="relative mx-auto mt-4 h-14 w-[88%] rounded-t-lg border border-white/85 bg-white/92 px-3 pt-2 shadow-sm">
            <div className="flex gap-1">
              <span className="size-1.5 rounded-full bg-[var(--w-pink-dust)]" />
              <span className="size-1.5 rounded-full bg-[var(--w-gold-soft-a)]/70" />
              <span className="size-1.5 rounded-full bg-[var(--w-beige-b)]" />
            </div>
            <div className="mt-2 h-1.5 w-2/3 rounded bg-[var(--w-blush-a)]/60" />
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {item.screenshotSrc ? (
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-wedinfo-serif text-lg font-semibold italic text-[var(--w-gold-deep)]">
                {item.couple}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--foreground)]/55">
                {item.date}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                isLive
                  ? "bg-[var(--w-gold-deep)]/92 text-[#fdfaf6]"
                  : "bg-[var(--foreground)]/10 text-[var(--foreground)]/55"
              }`}
            >
              {isLive ? "Na żywo" : "Demo"}
            </span>
          </div>
        ) : (
          <p className="text-xs text-[var(--foreground)]/55">
            <span className="font-mono text-[var(--foreground)]/40">{item.slug}</span>
            .weddinfo.pl
          </p>
        )}
        <p className="text-sm leading-relaxed text-[var(--foreground)]/72">
          {item.summary ??
            "Spersonalizowane kolory, sekcja RSVP i prosty harmonogram dnia — wszystko w jednej, lekkiej stronie."}
        </p>
        <div className="mt-auto pt-2">
          {item.liveUrl ? (
            <Link
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--w-gold-deep)] transition group-hover:text-[var(--foreground)]"
            >
              Otwórz stronę
              <span className="text-xs opacity-80" aria-hidden>
                ↗
              </span>
            </Link>
          ) : (
            <span className="text-sm font-medium text-[var(--w-gold-deep)]/90">Wkrótce podgląd na żywo</span>
          )}
        </div>
      </div>
    </article>
  );
}
