"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { InquiryTabId } from "@/config/inquiry-tabs";
import { inquiryTabs, resolveInquiryTabFromSearchParams } from "@/config/inquiry-tabs";
import { IndividualInquiryForm } from "./individual-inquiry-form";
import { PackageInquiryForm } from "./package-inquiry-form";
import { SimpleContactForm } from "./simple-contact-form";

export function InquiryFormsShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typ = searchParams.get("typ");
  const pakiet = searchParams.get("pakiet");

  const resolved = resolveInquiryTabFromSearchParams(typ, pakiet);
  const [activeTab, setActiveTab] = useState<InquiryTabId>(resolved);

  useEffect(() => {
    setActiveTab(resolved);
  }, [resolved]);

  const selectTab = useCallback(
    (tab: InquiryTabId) => {
      setActiveTab(tab);
      const params = new URLSearchParams();
      params.set("typ", tab);
      router.replace(`/kontakt?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  return (
    <div>
      <div
        role="tablist"
        aria-label="Typ formularza"
        className="flex flex-wrap gap-2 border-b border-[var(--border-light)] pb-4"
      >
        {inquiryTabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => selectTab(tab.id)}
              className={`touch-manipulation px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                selected
                  ? "bg-[var(--bg-dark)] text-white"
                  : "border border-[var(--border-light)] bg-white text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-[var(--text-dark)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-[var(--text-muted)]">
        {inquiryTabs.find((t) => t.id === activeTab)?.description}
      </p>

      <div className="mt-8" role="tabpanel">
        {activeTab === "individual" ? <IndividualInquiryForm /> : null}
        {activeTab === "premium" ? <PackageInquiryForm variant="premium" /> : null}
        {activeTab === "basic" ? <PackageInquiryForm variant="basic" /> : null}
        {activeTab === "contact" ? <SimpleContactForm /> : null}
      </div>
    </div>
  );
}
