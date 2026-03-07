import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    // 1. Historical Crime Data (for HEATMAP)
    const { data: crimeData, error: crimeDataError } = await supabaseAdmin
      .from("crime_data")
      .select(
        "lat, lng, year, total_crimes, theft, assault, harassment, stalking, murder, rape, ndps",
      );

    if (crimeDataError) throw crimeDataError;

    // 2. User Crime Reports (for POPUP markers)
    const { data: crimeReports, error: crimeReportError } = await supabaseAdmin
      .from("crime_reports")
      .select("id, lat, lng, type, created_at, description, status")
      .not("lat", "is", null)
      .not("lng", "is", null);

    if (crimeReportError) throw crimeReportError;

    // 3. Threat Zones (polygons)
    const { data: threatZones, error: zoneError } = await supabaseAdmin
      .from("threat_zones")
      .select("id, name, severity, geojson, created_at");

    if (zoneError) throw zoneError;

    // 4. Safety Infrastructure (POIs)
    const { data: safetyInfra, error: infraError } = await supabaseAdmin
      .from("safety_infra")
      .select("id, name, type, lat, lng, address, phone");

    if (infraError) throw infraError;

    // Build heatmap points from historical crime_data
    const maxCrimes = Math.max(
      ...(crimeData || []).map((r: any) => r.total_crimes || 0),
      1,
    );

    const heatPoints = (crimeData || []).map((r: any) => {
      const scaled = Math.log(r.total_crimes + 1) / Math.log(maxCrimes + 1);
      return {
        lat: Number(r.lat),
        lng: Number(r.lng),
        intensity: Math.max(0.1, Math.min(1, scaled)),
        total_crimes: r.total_crimes,
        theft: r.theft,
        assault: r.assault,
        harassment: r.harassment,
        stalking: r.stalking,
        murder: r.murder,
        rape: r.rape,
        ndps: r.ndps,
        year: r.year,
      };
    });

    // Build user report markers
    const reportMarkers = (crimeReports || []).map((r: any) => ({
      id: r.id,
      lat: r.lat,
      lng: r.lng,
      type: r.type,
      status: r.status,
      description: r.description,
      date: r.created_at,
    }));

    return NextResponse.json({
      heatPoints,
      reportMarkers,
      threatZones: threatZones || [],
      safetyInfra: safetyInfra || [],
      summary: {
        totalHeatPoints: heatPoints.length,
        totalReports: reportMarkers.length,
        totalZones: (threatZones || []).length,
        totalInfra: (safetyInfra || []).length,
        policeStations: (safetyInfra || []).filter(
          (i: any) => i.type === "police",
        ).length,
        hospitals: (safetyInfra || []).filter((i: any) => i.type === "hospital")
          .length,
        helpCenters: (safetyInfra || []).filter(
          (i: any) => i.type === "help_center",
        ).length,
      },
    });
  } catch (error: any) {
    console.error("Intelligence map data error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
