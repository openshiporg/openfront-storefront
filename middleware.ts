import { NextRequest } from "next/server";
import { openfrontClient } from "@/features/storefront/lib/config";
import { handleStorefrontRoutes } from "@/features/storefront/middleware";

// Get authenticated user from the request
export async function getAuthenticatedUser(request: NextRequest) {
  const query = `
    query authenticatedItem {
      authenticatedItem {
        ... on User {
          id
          role {
            canAccessDashboard
          }
        }
      }
      redirectToInit
    }
  `;

  // Pass cookie headers to openfrontClient
  const headers = {
    cookie: request.headers.get("cookie") || "",
  };

  try {
    const { authenticatedItem, redirectToInit } = await openfrontClient.request(
      query,
      {},
      headers
    );
    return {
      user: authenticatedItem,
      redirectToInit: redirectToInit,
    };
  } catch (error) {
    // Auth check is expected to fail when no user is logged in
    return { user: null, redirectToInit: false };
  }
}

export async function middleware(request: NextRequest) {
  const { user } = await getAuthenticatedUser(request);
  return handleStorefrontRoutes(request, user);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}