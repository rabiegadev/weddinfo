import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminSessionTokenEdge } from "@/lib/admin-session-edge";

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
  if (!(await verifyAdminSessionTokenEdge(token))) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
