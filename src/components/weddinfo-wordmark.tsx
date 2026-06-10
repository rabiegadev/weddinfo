import Link from "next/link";
import { Great_Vibes } from "next/font/google";

const weddinfoScript = Great_Vibes({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const sizeClass = {
  hero: "text-[2.25rem] leading-none sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.75rem]",
  header:
    "text-[1.75rem] leading-[1.2] sm:text-[2rem] md:text-[2.25rem] lg:text-[2.5rem]",
} as const;

const wrapperClass = {
  hero: "block shrink-0 py-2.5 sm:py-3 md:py-3.5",
  header: "block shrink-0 py-1 sm:py-1.5 md:py-1.5",
} as const;

type WeddinfoWordmarkProps = {
  size?: keyof typeof sizeClass;
  className?: string;
  linked?: boolean;
};

export function WeddinfoWordmark({
  size = "hero",
  className = "",
  linked = true,
}: WeddinfoWordmarkProps) {
  const label = (
    <span
      className={`${weddinfoScript.className} ${sizeClass[size]} text-[var(--gold)] select-none ${className}`}
    >
      Weddinfo
    </span>
  );

  if (!linked) {
    return <span className={wrapperClass[size]}>{label}</span>;
  }

  return (
    <Link
      href="/"
      className={`touch-manipulation ${wrapperClass[size]} transition hover:opacity-90 [-webkit-tap-highlight-color:transparent]`}
      aria-label="Weddinfo — strona główna"
    >
      {label}
    </Link>
  );
}
