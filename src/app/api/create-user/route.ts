import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST() {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("users_profile")
    .select("id")
    .eq("clerk_id", user.id);

  console.log("Existing user:", data);

  if (!data || data?.length === 0) {
    await supabaseAdmin.from("users_profile").insert({
      clerk_id: user.id,
      email: user.emailAddresses[0].emailAddress,
      full_name:user?.fullName ?? null,
      role: "USER",
    });

    console.log("INSERT ERROR:", error);
  }

  return NextResponse.json({ success: true });
}
