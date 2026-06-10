"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { resolveInquiryModeFromSearchParams, type InquiryFormMode } from "@/config/inquiry-tabs";
import { UnifiedInquiryForm } from "./unified-inquiry-form";

export function InquiryFormsShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typ = searchParams.get("typ");
  const pakiet = searchParams.get("pakiet");

  const resolved = resolveInquiryModeFromSearchParams(typ, pakiet);
  const [activeMode, setActiveMode] = useState<InquiryFormMode>(resolved);

  useEffect(() => {
    setActiveMode(resolved);
  }, [resolved]);

  const onModeChange = useCallback(
    (mode: InquiryFormMode) => {
      setActiveMode(mode);
      const params = new URLSearchParams();
      params.set("typ", mode);
      router.replace(`/kontakt?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  return <UnifiedInquiryForm initialMode={activeMode} onModeChange={onModeChange} />;
}
