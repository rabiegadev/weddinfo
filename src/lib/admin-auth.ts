import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSessionToken } from "@/lib/admin-session";

const COOKIE = "weddinfo_admin";

export async function getAdminCookie(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value;
}

export async function requireAdminSession(): Promise<void> {
  const raw = await getAdminCookie();
  if (!verifyAdminSessionToken(raw)) {
    redirect("/admin/login");
  }
}

export async function isAdminSessionValid(): Promise<boolean> {
  const raw = await getAdminCookie();
  return verifyAdminSessionToken(raw);
}

export const ADMIN_SESSION_COOKIE = COOKIE;
