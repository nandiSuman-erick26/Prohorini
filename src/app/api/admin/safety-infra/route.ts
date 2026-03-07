import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export const GET = async () => {
  // const { supabase } = await requireSuperAdmin();
  const { data, error } = await supabaseAdmin
    .from("safety_infra")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return NextResponse.json(data);
};

export const POST = async (req: Request) => {
  // const { supabase } = await requireSuperAdmin();
  const body = await req.json();
  const { name, type, address, phone, lat, lng } = body;

  const { error } = await supabaseAdmin
    .from("safety_infra")
    .insert({ name, type, address, phone, lat, lng });

  if (error) throw error;
  return NextResponse.json({ ok: true });
};

export const PATCH = async (req: Request) => {
  // const { supabase } = await requireSuperAdmin();
  const body = await req.json();
  const { id, name, type, address, phone, lat, lng } = body;
  const { error } = await supabaseAdmin
    .from("safety_infra")
    .update({ name, type, address, phone, lat, lng })
    .eq("id", id);
  if (error) throw error;
  return NextResponse.json({ ok: true });
};

export const DELETE = async (req: Request) => {
  // const { supabase } = await requireSuperAdmin();
  const { id } = await req.json();
  const { error } = await supabaseAdmin
    .from("safety_infra")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return NextResponse.json({ ok: true });
};
