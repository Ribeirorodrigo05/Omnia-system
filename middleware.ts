import {
  NextResponse,
  type MiddlewareConfig,
  type NextRequest,
} from "next/server";
// Middleware to protect routes in a Next.js application
// This middleware checks if the user is authenticated before allowing access to protected routes
export const config: MiddlewareConfig = {
  matcher: [
    // Match all routes except the public ones
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|forgot-password|reset-password|terms-of-service|privacy-policy|about|contact).*)",
  ],
};

const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/terms-of-service",
  "/privacy-policy",
  "/about",
  "/contact",
];

const REDIRECT_WHEN_UNAUTHENTICATED = "/sign-in";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (publicRoutes.includes(pathname)) {
    return;
  }

  const token = request.cookies.get("token");
  if (token) {
    return;
  }

  return Response.redirect(new URL(REDIRECT_WHEN_UNAUTHENTICATED, request.url));
}
