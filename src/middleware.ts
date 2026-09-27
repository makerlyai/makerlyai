import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_EXTENSIONS = [
  ".env",
  ".git",
  ".sql",
  ".bak",
  ".config",
  ".php",
  "wp-admin",
  "wp-login",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase();

  // Block reconnaissance & exposed file scanning attacks
  for (const pattern of BLOCKED_EXTENSIONS) {
    if (pathname.includes(pattern)) {
      return new NextResponse("Access Denied", { status: 403 });
    }
  }

  // Handle case rewrite for CRM
  const url = request.nextUrl.clone();
  if (url.pathname === "/CRM" || url.pathname.startsWith("/CRM/")) {
    url.pathname = url.pathname.replace(/^\/CRM/, "/crm");
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
