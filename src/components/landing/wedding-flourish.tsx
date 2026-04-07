/** Delikatny ornament pod nagłówki sekcji */
export function WeddingFlourish({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`mx-auto h-4 w-24 text-rose-300/80 ${className}`}
      viewBox="0 0 120 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M60 8c-8-6-16-6-24 0M60 8c8-6 16-6 24 0M12 8h8M100 8h8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="60" cy="8" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
