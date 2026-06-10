"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { inputClass, labelClass } from "@/app/kontakt/form-ui";
import { adminLoginAction } from "./actions";

export function AdminLoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const password = String(new FormData(e.currentTarget).get("password") ?? "");
        startTransition(async () => {
          const res = await adminLoginAction(password);
          if (!res.ok) {
            setError(res.error);
            return;
          }
          router.push("/admin/zapytania");
          router.refresh();
        });
      }}
    >
      <div>
        <label htmlFor="admin-password" className={labelClass}>
          Hasło admina
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
      {error ? (
        <p className="rounded border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Logowanie…" : "Zaloguj"}
      </button>
    </form>
  );
}
