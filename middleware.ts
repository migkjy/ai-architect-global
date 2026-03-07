import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except Next.js internals, static files, and legal pages (served via rewrites)
  matcher: ["/((?!api|_next|_vercel|og-image|terms|privacy|refund|.*\\..*).*)"],
};
