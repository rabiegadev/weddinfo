import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Logowanie — Weddinfo",
};

export default async function AdminLoginPage() {
  if (await isAdminSessionValid()) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center px-4 py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] pt-[max(2.5rem,env(safe-area-inset-top,0px))] sm:min-h-[70vh] sm:py-12">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Panel administracyjny
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Zaloguj się hasłem. Hash hasła ustawiasz w zmiennej{" "}
        <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">
          WEDDINFO_ADMIN_PASSWORD_HASH
        </code>{" "}
        (bcrypt). Wygeneruj go poleceniem{" "}
        <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">
          npm run admin:hash-password
        </code>
        .
      </p>
      <AdminLoginForm />
      <p className="mt-8 text-sm">
        <Link href="/" className="text-rose-800 hover:underline dark:text-rose-200">
          ← Wróć na stronę główną
        </Link>
      </p>
    </div>
  );
}
