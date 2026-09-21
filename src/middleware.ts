import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (url.pathname === "/CRM" || url.pathname.startsWith("/CRM/")) {
    url.pathname = url.pathname.replace(/^\/CRM/, "/crm");
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/CRM", "/CRM/:path*"],
};
