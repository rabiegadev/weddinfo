import Image from "next/image";
import { cooperationSteps as steps } from "@/data/cooperation-steps";
import { LandingSectionInner } from "./landing-section-inner";
import { PricingSection } from "./pricing-section";
import { StatusCheckPanel } from "./status-check-panel";

export function CooperationPricingBlock() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute top-8 right-0 bottom-8 z-[1] hidden w-[min(42vw,540px)] lg:block"
        aria-hidden
      >
        <Image
          src="/images/flowers.png"
          alt=""
          fill
          sizes="(max-width: 1280px) 42vw, 540px"
          className="object-contain object-right"
        />
      </div>

      <div
        id="wspolpraca"
        className="scroll-mt-header relative z-[2] bg-[var(--bg-white)]"
        aria-labelledby="cooperation-heading"
      >
        <div className="grid lg:grid-cols-[minmax(0,1fr)_min(440px,42%)] lg:items-stretch xl:grid-cols-[1fr_480px] 2xl:grid-cols-[1fr_520px]">
          <LandingSectionInner className="py-14 sm:py-20 lg:max-w-none lg:pr-[min(44vw,520px)]">
            <h2
              id="cooperation-heading"
              className="font-wedinfo-serif text-left text-3xl font-medium text-[var(--text-dark)] sm:text-4xl lg:text-[2.75rem]"
            >
              Jak wygląda współpraca?
            </h2>
            <ol className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-6 xl:gap-8">
              {steps.map((step, index) => (
                <li key={step.num} className="relative flex flex-col">
                  {index < steps.length - 1 ? (
                    <span
                      className="pointer-events-none absolute top-11 left-[calc(50%+2.75rem)] hidden h-px w-[calc(100%-5.5rem)] bg-[var(--gold-line)] lg:block"
                      aria-hidden
                    />
                  ) : null}
                  <div className="flex size-[4.5rem] items-center justify-center rounded-full border border-[var(--gold-line)] bg-[var(--bg-white)] sm:size-20">
                    <Image
                      src={step.icon}
                      alt=""
                      width={48}
                      height={48}
                      className="size-10 object-contain sm:size-12"
                    />
                  </div>
                  <p className="mt-5 text-sm font-semibold tracking-[0.2em] text-[var(--gold)]">{step.num}</p>
                  <h3 className="mt-2 text-lg font-semibold text-[var(--text-dark)]">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-[var(--text-muted)]">{step.description}</p>
                </li>
              ))}
            </ol>
          </LandingSectionInner>

          <div className="flex justify-center px-5 pb-14 pt-0 sm:px-8 lg:min-h-0 lg:justify-end lg:self-stretch lg:px-0 lg:pb-20 lg:pt-0 lg:pr-12 xl:pr-20 2xl:pr-24">
            <div className="flex w-full max-w-[480px] flex-1 flex-col lg:max-w-[520px] lg:-translate-x-14 xl:-translate-x-20 2xl:-translate-x-24">
              <StatusCheckPanel connectedTop />
            </div>
          </div>
        </div>
      </div>

      <PricingSection />
    </div>
  );
}
