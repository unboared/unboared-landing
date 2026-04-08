import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Remove "/" from matcher so next-intl doesn't intercept the root path.
  // The root redirect (with Accept-Language detection) is handled by src/app/page.tsx.
  matcher: ["/(fr|en)/:path*"],
};
