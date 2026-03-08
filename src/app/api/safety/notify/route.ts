import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendSafetyAlertEmail } from "@/services/api/brevo.api";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { zoneName, lat, lng } = await req.json();

    // 1. Get the current user's profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("users_profile")
      .select("id, full_name")
      .eq("clerk_id", user.id)
      .single();

    if (profileError || !userProfile) {
      throw new Error("User profile not found");
    }

    // 2. Log the event to safety_logs for Admin audit
    const { error: logError } = await supabaseAdmin.from("safety_logs").insert({
      user_id: userProfile.id,
      event_type: "zone_alert",
      zone_name: zoneName,
      lat: lat,
      lng: lng,
      details: { status: "notified_circle", method: "email" },
    });

    if (logError) console.error("Logging failed:", logError);

    // 3. Fetch circle members with notify_on_denger enabled
    const { data: members, error: membersError } = await supabaseAdmin
      .from("emergency_contacts")
      .select("email, name")
      .eq("user_id", userProfile.id)
      .eq("notify_on_denger", true);

    if (membersError) throw membersError;

    if (!members || members.length === 0) {
      return NextResponse.json(
        { message: "No members to notify" },
        { status: 200 },
      );
    }

    // 4. Filter to only members that have an email address
    const membersWithEmail = members.filter(
      (m) => m.email && m.email.trim() !== "",
    );

    if (membersWithEmail.length === 0) {
      return NextResponse.json(
        { message: "No members with email to notify" },
        { status: 200 },
      );
    }

    // 5. Dispatch emails via Brevo for each member (allSettled so one failure doesn't block others)
    const results = await Promise.allSettled(
      membersWithEmail.map((member) =>
        sendSafetyAlertEmail({
          receiverEmail: member.email,
          receiverName: member.name,
          senderName: userProfile.full_name,
          zoneName: zoneName,
          locationLink: `https://www.google.com/maps?q=${lat},${lng}`,
          timestamp: new Date().toLocaleString(),
        }),
      ),
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    if (failed > 0) {
      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === "rejected")
        .map((r) => r.reason?.message || "Unknown");
      console.error("Some alerts failed:", errors);
    }

    return NextResponse.json({ success: true, sent: succeeded, failed });
  } catch (error: any) {
    console.error("Alert dispatch failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
