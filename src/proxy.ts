import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_TTL_SECONDS } from "@/lib/admin-session-config";
import {
  signAdminSessionTokenEdge,
  verifyAdminSessionTokenEdge,
} from "@/lib/admin-session-edge";

/** Ochrona panelu admina (Next 16: konwencja `proxy` zamiast `middleware`). */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login" || pathname === "/admin/logout") {
    return NextResponse.next();
  }
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  const token = request.cookies.get("weddinfo_admin")?.value;
  if (!token || !(await verifyAdminSessionTokenEdge(token))) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const refreshedToken = await signAdminSessionTokenEdge();
  const response = NextResponse.next();
  response.cookies.set("weddinfo_admin", refreshedToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
