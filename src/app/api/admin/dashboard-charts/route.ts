import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { startOfDay, subDays, format, eachDayOfInterval } from "date-fns";

export async function GET() {
  try {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 29);

    // 1. Fetch incident trends for the last 30 days
    const { data: trendData, error: trendError } = await supabaseAdmin
      .from("crime_reports")
      .select("created_at")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    if (trendError) throw trendError;

    // Process trend data
    const days = eachDayOfInterval({
      start: thirtyDaysAgo,
      end: today,
    });

    const trendMap = trendData.reduce((acc: any, report: any) => {
      const date = format(new Date(report.created_at), "MMM dd");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const trends = days.map((day) => {
      const dateStr = format(day, "MMM dd");
      return {
        date: dateStr,
        count: trendMap[dateStr] || 0,
      };
    });

    // 2. Fetch incident distribution by type
    const { data: typeData, error: typeError } = await supabaseAdmin
      .from("crime_reports")
      .select("type");

    if (typeError) throw typeError;

    const typeCounts = typeData.reduce((acc: any, report: any) => {
      const type = report.type || "other";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const distribution = Object.entries(typeCounts).map(([type, value]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1).replace("_", " "),
      value,
    }));

    // 3. Fetch severity/priority stats (SOS vs Regular)
    const { data: logsData, error: logsError } = await supabaseAdmin
      .from("safety_logs")
      .select("event_type")
      .gte("created_at", subDays(today, 7).toISOString());

    if (logsError) throw logsError;

    const sosCounts = logsData.reduce((acc: any, log: any) => {
      const type = log.event_type || "unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const priorityStats = [
      { name: "SOS Alerts", count: sosCounts["sos_alert"] || 0 },
      { name: "Zone Entry", count: sosCounts["zone_entry"] || 0 },
      { name: "Zone Alert", count: sosCounts["zone_alert"] || 0 },
    ];

    return NextResponse.json({
      trends,
      distribution,
      priorityStats,
    });
  } catch (error: any) {
    console.error("Dashboard charts error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
