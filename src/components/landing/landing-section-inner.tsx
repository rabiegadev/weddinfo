import type { ReactNode } from "react";

type LandingSectionInnerProps = {
  children: ReactNode;
  className?: string;
};

/** Pełna szerokość z responsywnym paddingiem bocznym. */
export function LandingSectionInner({ children, className = "" }: LandingSectionInnerProps) {
  return (
    <div className={`w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 ${className}`}>
      {children}
    </div>
  );
}
