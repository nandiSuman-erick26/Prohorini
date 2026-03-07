import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    // 1. Total Users
    const { count: totalUsers, error: usersError } = await supabaseAdmin
      .from("users_profile")
      .select("*", { count: "exact", head: true });

    // 2. Active SOS Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: sosToday, error: sosError } = await supabaseAdmin
      .from("safety_logs")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "zone_alert")
      .gte("created_at", today.toISOString());

    // 3. High Risk Zones
    const { count: totalZones, error: zonesError } = await supabaseAdmin
      .from("threat_zones")
      .select("*", { count: "exact", head: true });

    // 4. Pending Reports
    const { count: pendingReports, error: reportsError } = await supabaseAdmin
      .from("crime_reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    if (usersError || sosError || zonesError || reportsError) {
      console.error("Stats fetch error:", {
        usersError,
        sosError,
        zonesError,
        reportsError,
      });
    }

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      sosToday: sosToday || 0,
      totalZones: totalZones || 0,
      pendingReports: pendingReports || 0,
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
