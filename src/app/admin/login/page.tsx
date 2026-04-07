import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Logowanie — Wedinfo",
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Panel administracyjny
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Logowanie bez hasła (magic link na e-mail) zostanie podpięte w kolejnym
        kroku — np. Auth.js + Resend.
      </p>
      <p className="mt-8 text-sm">
        <Link href="/" className="text-rose-800 hover:underline dark:text-rose-200">
          ← Wróć na stronę główną
        </Link>
      </p>
    </div>
  );
}
