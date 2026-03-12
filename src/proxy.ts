import type { NextFetchEvent, NextRequest } from "next/server";
import nextAuthMiddleware, { type NextRequestWithAuth } from "next-auth/middleware";

/**
 * next-auth’s withAuth() is typed for NextRequestWithAuth; at runtime Next passes a normal
 * NextRequest (nextauth is attached when the handler runs). Cast is the supported pattern.
 */
export function proxy(request: NextRequest, event: NextFetchEvent) {
    return nextAuthMiddleware(request as NextRequestWithAuth, event);
}

export const config = { matcher: ["/app/:path*"] };
