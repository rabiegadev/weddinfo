import Link from "next/link";
import { Great_Vibes } from "next/font/google";

const weddinfoScript = Great_Vibes({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const sizeClass = {
  hero: "text-[2.25rem] leading-none sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.75rem]",
  header: "text-[1.9rem] leading-none sm:text-[2.25rem] md:text-[2.6rem] lg:text-[3rem]",
} as const;

const wrapperClass =
  "block shrink-0 py-2.5 sm:py-3 md:py-3.5";

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
    return <span className={wrapperClass}>{label}</span>;
  }

  return (
    <Link
      href="/"
      className={`touch-manipulation ${wrapperClass} transition hover:opacity-90 [-webkit-tap-highlight-color:transparent]`}
      aria-label="Weddinfo — strona główna"
    >
      {label}
    </Link>
  );
}
