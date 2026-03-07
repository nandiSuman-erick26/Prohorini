import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("profile-photo") as File;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const filePath = `${user.id}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("image_container")
    .upload(filePath, file);

  if (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data: profilePhotoUrl } = supabase.storage
    .from("image_container")
    .getPublicUrl(filePath);

  //save photo url in the users table
  const { error: updateError } = await supabaseAdmin
    .from("users_profile")
    .update({ photo_url: profilePhotoUrl.publicUrl })
    .eq("clerk_id", user.id);

  if (updateError) {
    console.error("Database update error:", updateError);
    return NextResponse.json(
      { error: "Failed to update profile", details: updateError },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
