import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone, relationship } = body;

  const { data: user_profile, error } = await supabaseAdmin
    .from("users_profile")
    .select("id")
    .eq("clerk_id", user?.id)
    .single();

  if (error || !user_profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const { error: insertError } = await supabaseAdmin
    .from("emergency_contacts")
    .insert({
      user_id: user_profile?.id,
      name,
      phone,
      relationship,
    });

  if (insertError) {
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  // Verify ownership before deleting
  const { data: contact, error: fetchError } = await supabaseAdmin
    .from("emergency_contacts")
    .select("users_profile(clerk_id)")
    .eq("id", id)
    .single();

  if (fetchError || !contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  // @ts-ignore - Supabase join typing can be tricky
  if (contact.users_profile.clerk_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: deleteError } = await supabaseAdmin
    .from("emergency_contacts")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const body = await req.json();
  const { name, phone, relationship, email, notify_on_denger } = body;

  // Verify ownership
  const { data: contact, error: fetchError } = await supabaseAdmin
    .from("emergency_contacts")
    .select("users_profile(clerk_id)")
    .eq("id", id)
    .single();

  if (fetchError || !contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  // @ts-ignore
  if (contact.users_profile.clerk_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: updateError } = await supabaseAdmin
    .from("emergency_contacts")
    .update({
      name,
      phone,
      relationship,
      email,
      notify_on_denger,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
