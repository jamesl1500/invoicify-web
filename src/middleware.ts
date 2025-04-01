import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Define protected routes
    const protectedRoutes = ["/dashboard", "/settings"];

    if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login if not authenticated
        }
    }

    return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
    matcher: ["/dashboard/:path*", "/settings/:path*"], // Protect all paths under /dashboard and /settings
};