import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const admin = await currentUser();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetClerkId, is_verified } = await req.json();

  // 1. Fetch requester profile
  const { data: adminProfile } = await supabaseAdmin
    .from("users_profile")
    .select("role")
    .eq("clerk_id", admin.id)
    .single();

  if (!adminProfile || !["ADMIN", "SUPER_ADMIN"].includes(adminProfile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Fetch target profile to enforce role hierarchy
  const { data: targetProfile } = await supabaseAdmin
    .from("users_profile")
    .select("role")
    .eq("clerk_id", targetClerkId)
    .single();

  if (!targetProfile) {
    return NextResponse.json(
      { error: "Target user not found" },
      { status: 404 },
    );
  }

  // ADMIN can only manage USERS. SUPER_ADMIN can manage all.
  if (adminProfile.role === "ADMIN" && targetProfile.role !== "USER") {
    return NextResponse.json(
      { error: "Admins can only verify regular users" },
      { status: 403 },
    );
  }

  const { error } = await supabaseAdmin
    .from("users_profile")
    .update({ is_verified })
    .eq("clerk_id", targetClerkId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
