import { supabase } from "@/lib/supabaseClient";

export const getApprovedReports = async () => {
  const { data, error } = await supabase
    .from("crime_reports")
    .select("*")
    .eq("status", "approved");
  if (error) {
    // console.log("Error fetching approved reports:", error);
    return [];
  }
  return data;
};
