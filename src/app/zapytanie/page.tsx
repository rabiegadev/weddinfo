import type { Metadata } from "next";
import { InquiryStatusShell } from "@/components/inquiry/inquiry-status-shell";
import { StatusCheckForm } from "@/components/inquiry/status-check-form";

export const metadata: Metadata = {
  title: "Status zgłoszenia",
  description: "Sprawdź status zgłoszenia Weddinfo — numer i hasło z e-maila potwierdzającego.",
};

export default function StatusLookupPage() {
  return (
    <InquiryStatusShell
      title="Sprawdź postęp"
      subtitle="Numer i hasło znajdziesz w e-mailu wysłanym po złożeniu formularza."
      width="narrow"
    >
      <StatusCheckForm />
    </InquiryStatusShell>
  );
}
