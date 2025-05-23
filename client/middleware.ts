import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/lib/middlewares/authorization.mw";

export function middleware(req: NextRequest) {
  // Apply the auth middleware
  const authResponse = authMiddleware(req);
  if (authResponse) return authResponse;

  // Apply the analytics middleware (uncomment when needed)
  // const analyticsResponse = analyticsMiddleware(req);
  // if (analyticsResponse) return analyticsResponse;

  // Default response if no other middleware blocks the request
  return NextResponse.next();
}

// Specify which paths to apply the middleware to
// export const config = {
//   matcher: ["/","/dashboard"],
// };
