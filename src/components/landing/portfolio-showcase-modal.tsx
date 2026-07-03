"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { PortfolioExample, PortfolioShowcaseSlide } from "@/data/portfolio-examples";

type PortfolioShowcaseModalProps = {
  item: PortfolioExample;
  open: boolean;
  onClose: () => void;
};

type ShowcaseSlideProps = {
  slide: PortfolioShowcaseSlide;
  index: number;
  onEnlarge: () => void;
};

function ShowcaseSlide({ slide, index, onEnlarge }: ShowcaseSlideProps) {
  return (
    <figure className="overflow-hidden border border-white/10 bg-[#1a1a1a]">
      <button
        type="button"
        onClick={onEnlarge}
        className="group relative block aspect-[4/3] w-full cursor-zoom-in bg-[#0d0d0d]"
        aria-label={`Powiększ: ${slide.alt}`}
      >
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover object-top transition duration-300 group-hover:brightness-110"
          priority={index < 2}
        />
        <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
        <span className="pointer-events-none absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/80 opacity-0 transition group-hover:opacity-100">
          <svg viewBox="0 0 24 24" fill="none" className="size-4" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {slide.caption ? (
        <figcaption className="border-t border-white/10 px-3 py-2 text-xs text-white/50">{slide.caption}</figcaption>
      ) : null}
    </figure>
  );
}

type ShowcaseLightboxProps = {
  slides: readonly PortfolioShowcaseSlide[];
  index: number;
  couple: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

function ShowcaseLightbox({ slides, index, couple, onClose, onPrev, onNext }: ShowcaseLightboxProps) {
  const slide = slides[index];
  const hasPrev = index > 0;
  const hasNext = index < slides.length - 1;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft" && hasPrev) {
        onPrev();
      } else if (event.key === "ArrowRight" && hasNext) {
        onNext();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-[#0a0a0a]/98">
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
        <p className="truncate text-xs text-white/50">
          {couple} · {index + 1} / {slides.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60 transition hover:text-white"
        >
          Zamknij
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center p-4 sm:p-8">
        <button
          type="button"
          className="absolute inset-0"
          aria-label="Zamknij powiększenie"
          onClick={onClose}
        />

        {hasPrev ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute top-1/2 left-2 z-[1] flex size-10 -translate-y-1/2 items-center justify-center border border-white/15 bg-black/60 text-white/80 transition hover:border-[var(--gold)]/40 hover:text-[var(--gold)] sm:left-4 sm:size-11"
            aria-label="Poprzednie zdjęcie"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}

        <div
          className="relative z-[1] h-full max-h-[calc(100dvh-8rem)] w-full max-w-5xl"
          onClick={(e) => e.stopPropagation()}
          role="presentation"
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            className="object-contain object-center"
            priority
          />
        </div>

        {hasNext ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute top-1/2 right-2 z-[1] flex size-10 -translate-y-1/2 items-center justify-center border border-white/15 bg-black/60 text-white/80 transition hover:border-[var(--gold)]/40 hover:text-[var(--gold)] sm:right-4 sm:size-11"
            aria-label="Następne zdjęcie"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
      </div>

      {slide.caption ? (
        <p className="shrink-0 border-t border-white/10 px-4 py-3 text-center text-sm text-white/55 sm:px-6">
          {slide.caption}
        </p>
      ) : null}
    </div>
  );
}

export function PortfolioShowcaseModal({ item, open, onClose }: PortfolioShowcaseModalProps) {
  const showcase = item.showcase;
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (lightboxIndex !== null) {
          closeLightbox();
        } else {
          onClose();
        }
      }
    },
    [onClose, lightboxIndex, closeLightbox],
  );

  useEffect(() => {
    if (!open) {
      setLightboxIndex(null);
      return;
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, handleKeyDown]);

  if (!open || !showcase) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4">
        <button
          type="button"
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          aria-label="Zamknij podgląd"
          onClick={onClose}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="inquiry-notice-dialog relative z-[1] flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden border border-white/10 bg-[#141414] shadow-[0_24px_64px_rgba(0,0,0,0.55)] sm:max-h-[90dvh]"
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6 sm:py-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                {showcase.modalLabel ?? "Podgląd projektu"}
              </p>
              <h2 id={titleId} className="font-wedinfo-serif mt-1 text-xl text-white sm:text-2xl">
                {item.couple}
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="shrink-0 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50 transition hover:text-white"
            >
              Zamknij
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
            <p className="text-sm leading-relaxed text-white/60">{showcase.modalDescription}</p>
            <p className="mt-2 text-[11px] text-white/35">Kliknij zdjęcie, aby je powiększyć.</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
              {showcase.slides.map((slide, index) => (
                <ShowcaseSlide
                  key={slide.src}
                  slide={slide}
                  index={index}
                  onEnlarge={() => setLightboxIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {lightboxIndex !== null ? (
        <ShowcaseLightbox
          slides={showcase.slides}
          index={lightboxIndex}
          couple={item.couple}
          onClose={closeLightbox}
          onPrev={() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() =>
            setLightboxIndex((i) =>
              i !== null && i < showcase.slides.length - 1 ? i + 1 : i,
            )
          }
        />
      ) : null}
    </>
  );
}
