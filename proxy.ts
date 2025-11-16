import type { NextRequest } from "next/server";
import { handleStorefrontRoutes } from "@/features/storefront/middleware";

// Main middleware function that handles all routes
export async function proxy(request: NextRequest) {
  // Only handle storefront routes
  return handleStorefrontRoutes(request, null);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.svg|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
};
