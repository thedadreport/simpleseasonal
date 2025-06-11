import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Extend the NextAuth middleware with custom logic
export default withAuth(
  function middleware(req: NextRequest) {
    // Add any custom middleware logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true if the user is authenticated
      authorized: ({ token }) => !!token,
    },
  }
);

// Specify which routes should be protected by the middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/meal-plans/:path*",
    "/account/:path*",
    "/api/meal-plans/:path*",
    "/api/user/:path*",
  ],
};