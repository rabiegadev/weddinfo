import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LandingSectionInner } from "@/components/landing/landing-section-inner";
import { hasAdminSession } from "@/lib/admin-session";
import { AdminLoginForm } from "./admin-login-form";

export const metadata: Metadata = {
  title: "Panel admina",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await hasAdminSession()) {
    redirect("/admin/zapytania");
  }

  return (
    <div className="px-4 pb-16 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6">
      <LandingSectionInner className="max-w-md">
        <h1 className="font-wedinfo-serif text-2xl text-[var(--text-dark)]">Panel admina</h1>
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          Logowanie do przeglądu zgłoszeń i odpowiedzi klientom.
        </p>
        <div className="mt-8 border border-[var(--border-light)] bg-white p-6 sm:p-8">
          <AdminLoginForm />
        </div>
      </LandingSectionInner>
    </div>
  );
}
