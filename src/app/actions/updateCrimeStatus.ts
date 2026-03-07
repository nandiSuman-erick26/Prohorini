"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function updateCrimeReportStatus(
  id: string,
  status: "approved" | "rejected",
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from("crime_reports")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("[updateCrimeReportStatus] Supabase error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
