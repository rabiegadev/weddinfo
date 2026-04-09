/**
 * Strzałka w dół — animacja tylko na wewnętrznym elemencie (translateY), centrowanie flexem zamiast left 50% + transform.
 */
export function WelcomeScrollChevron() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center sm:bottom-8">
      <a
        href="#glowna-tresc"
        className="pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--w-gold-deep)]"
        aria-label="Przewiń do treści strony"
      >
        <span className="wedinfo-welcome-scroll-inner inline-block">
          <svg
            viewBox="0 0 48 64"
            className="h-12 w-8 text-[#6b5a42] sm:h-14 sm:w-9"
            fill="none"
            aria-hidden
          >
            <rect
              x="5"
              y="4"
              width="38"
              height="56"
              rx="19"
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeWidth="1.1"
              fill="rgba(250,246,238,0.5)"
            />
            <path
              d="M14 28l10 11 10-11"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 38l7 8 7-8"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.78"
            />
          </svg>
        </span>
      </a>
    </div>
  );
}
