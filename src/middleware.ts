import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "./lib/supabaseAdmin";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;
  const url = req.nextUrl;
  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isApiRoute = pathname.startsWith("/api");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isPublicPage = pathname === "/";

  if (!userId) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isAuthPage && !isPublicPage) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    return;
  }

  const { data: user_profile } = await supabaseAdmin
    .from("users_profile")
    .select("role")
    .eq("clerk_id", userId)
    .single();

  const role = user_profile?.role;
  console.log("fetching role", role);

  if (isAuthPage) {
    const target =
      role === "ADMIN" || role === "SUPER_ADMIN" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(target, req.url));
  }

  // API ROLE PROTECTION
  if (isApiRoute) {
    // Only block if it's an admin API AND the user is a regular USER AND it's a write operation
    // Regular USERS should still be able to GET threat zones and infrastructure for their map
    if (role === "USER" && isAdminApi && req.method !== "GET") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return; // Allow the API routes to handle their own specific auth/logic for non-blocked cases
  }

  // PAGE ROLE PROTECTION (Navigation)
  if (role === "USER") {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (
    (role === "ADMIN" || role === "SUPER_ADMIN") &&
    !isAdminRoute &&
    pathname === "/dashboard"
  ) {
    // Only redirect if they aren't on an admin page and aren't specifically trying to see the dashboard (to allow previewing)
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // if (role === "SUPER_ADMIN") {
  //   return NextResponse.redirect(new URL("/super-admin", req.url));
  // }
  // if (isProtectedRoute(req)) {
  //   auth.protect();
  // }
  return;
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
