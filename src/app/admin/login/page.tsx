import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Logowanie — Wedinfo",
};

export default async function AdminLoginPage() {
  if (await isAdminSessionValid()) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
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
