import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { userProfileSchema } from "@/services/validations/schemas/zod.userProfile";
// import { userProfileSchema } from "@/lib/schemas/zod.userProfile";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const validation = userProfileSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.flatten() },
      { status: 400 },
    );
  }

  const { phone, address, city, full_name, state } = validation.data;

  await supabaseAdmin
    .from("users_profile")
    .update({
      phone,
      address,
      city,
      full_name,
      state,
    })
    .eq("clerk_id", user.id);

  return NextResponse.json({ success: true });
}
