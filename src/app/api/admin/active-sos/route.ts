import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data: activeSos, error } = await supabaseAdmin
      .from("live_locations")
      .select("*, users_profile(full_name, email, phone)")
      .eq("is_sos_active", true);

    if (error) throw error;

    return NextResponse.json(activeSos);
  } catch (error: any) {
    console.error("Failed to fetch active SOS:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
