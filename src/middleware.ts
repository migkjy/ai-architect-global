import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /ko 및 /ko/* 경로를 301로 / 에 영구 리다이렉트
  if (pathname === "/ko" || pathname.startsWith("/ko/")) {
    return NextResponse.redirect(new URL("/", request.url), 301);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|og-image|terms|privacy|refund|.*\\..*).*)"],
};
