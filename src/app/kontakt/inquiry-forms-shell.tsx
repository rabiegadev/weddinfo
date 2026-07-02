"use client";

import { ContactInquiryForm } from "./contact-inquiry-form";
import { InquiryFormsNotice } from "@/components/inquiry-forms-notice";

export function InquiryFormsShell() {
  return (
    <>
      <InquiryFormsNotice />
      <ContactInquiryForm />
    </>
  );
}
