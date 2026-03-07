import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/adminGuard";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const GET = async () => {
  // const { supabase } = await requireSuperAdmin();

  const { data, error } = await supabaseAdmin
    .from("threat_zones")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  console.log(error);

  return NextResponse.json(data);
};

export const POST = async (req: Request) => {
  // const { supabase } = await requireSuperAdmin();
  const body = await req.json();

  const { name, severity, geojson, type } = body;
  // console.log("BACKEND BODY", geojson);
  // console.log("type", typeof geojson);
  // console.log("IS_NULL", geojson === null);

  const { error } = await supabaseAdmin
    .from("threat_zones")
    .insert({ name, severity, geojson, type });

  if (error) throw error;

  return NextResponse.json({ ok: true });
};

export const PATCH = async (req: Request) => {
  // const { supabase } = await requireSuperAdmin();
  const { id, geojson, severity } = await req.json();

  const { error } = await supabaseAdmin
    .from("threat_zones")
    .update({ geojson, severity })
    .eq("id", id);
  if (error) throw error;
  return NextResponse.json({ ok: true });
};

export const DELETE = async (req: Request) => {
  // const { supabase } = await requireSuperAdmin();
  const { id } = await req.json();
  const { error } = await supabaseAdmin
    .from("threat_zones")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return NextResponse.json({ ok: true });
};
