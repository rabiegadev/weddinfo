"use client";

import { useState } from "react";
import type { PortfolioExample } from "@/data/portfolio-examples";
import { PortfolioShowcaseModal } from "./portfolio-showcase-modal";

export function usePortfolioShowcaseModal(item: PortfolioExample) {
  const [open, setOpen] = useState(false);
  const showcase = item.showcase;

  return {
    hasShowcase: Boolean(showcase),
    open,
    openModal: () => setOpen(true),
    closeModal: () => setOpen(false),
    modal: showcase ? (
      <PortfolioShowcaseModal item={item} open={open} onClose={() => setOpen(false)} />
    ) : null,
  };
}
