
import { getSupabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
  console.log(
    "===================================================================================",
  );
  console.log(
    "===================================================================================",
  );
  console.log("Threat API hit");
  console.log(
    "===================================================================================",
  );
  console.log(
    "===================================================================================",
  );

  const supabase = await getSupabaseServer();

  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category") || "all";
  const severityParam = searchParams.get("severity");
  const yearParam = searchParams.get("year");

  let query = supabase
    .from("crime_data")
    .select(
      "lat, lng, year, total_crimes, theft, assault, harassment, stalking, murder, rape, ndps",
    );

  // Year filter
  if (yearParam) {
    query = query.eq("year", Number(yearParam));
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ ok: true, length: 0, data: [] });
  }

  // 🔥 Step 1 — Compute Absolute Category Weight Per Row
  const weightedData = data.map((row: any) => {
    let categoryWeight = 0;

    switch (category) {
      // 🔴 Sexual crimes
      case "sexual_crime":
        categoryWeight = row.rape + row.harassment + row.stalking;
        break;

      // 🟠 Violent crimes
      case "violent_assault":
        categoryWeight = row.assault + row.murder;
        break;

      // 🟡 Drug crimes
      case "drug_related":
        categoryWeight = row.ndps;
        break;

      // 🔵 Property crime
      case "property_crime":
        categoryWeight = row.theft;
        break;

      // ⚪ All crimes
      default:
        categoryWeight = row.total_crimes;
    }

    return {
      ...row,
      categoryWeight,
    };
  });

  // 🔥 Step 2 — Dynamic Absolute Scaling (MAX-based)
  const maxWeight = Math.max(...weightedData.map((d: any) => d.categoryWeight));

  const normalizeSeverity = (count: number) => {
    if (count === 0) return 1;
    const scaled = Math.log(count + 1) / Math.log(maxWeight + 1);
    return Math.max(1, Math.min(5, Math.ceil(scaled * 5)));
  };

  const finalData = weightedData.map((row: any) => ({
    lat: Number(row.lat),
    lng: Number(row.lng),
    severity: normalizeSeverity(row.categoryWeight),
    categoryWeight: row.categoryWeight,
  }));

  // 🔥 Step 3 — Severity Filter
  let filtered = finalData;

  if (severityParam && severityParam !== "all") {
    filtered = finalData.filter(
      (row: any) => row.severity === Number(severityParam),
    );
  }

  return NextResponse.json({
    ok: true,
    length: filtered.length,
    data: filtered,
  });
}