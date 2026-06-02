import type { Metadata } from "next";
import Link from "next/link";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";
import { StatusCheckPanel } from "@/components/landing/status-check-panel";

export const metadata: Metadata = {
  title: "Status zgłoszenia",
  description: "Sprawdź status zgłoszenia Weddinfo — numer i hasło z e-maila potwierdzającego.",
};

export default function StatusLookupPage() {
  return (
    <div className="page-below-header pb-16">
      <LandingSectionInner className="max-w-lg">
        <p className="mb-8 text-sm">
          <Link href="/kontakt" className="text-[var(--gold)] hover:underline">
            ← Formularze kontaktowe
          </Link>
        </p>
        <div className="overflow-hidden rounded border border-[var(--border-light)] bg-white shadow-sm">
          <StatusCheckPanel />
        </div>
      </LandingSectionInner>
    </div>
  );
}
