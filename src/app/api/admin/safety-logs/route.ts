import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data: logs, error } = await supabaseAdmin
      .from("safety_logs")
      .select("*, users_profile(full_name, email)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("Failed to fetch safety logs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
