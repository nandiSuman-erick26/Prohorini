import { supabase } from "../supabaseClient";

export async function getAlluserProfiles() {
  const { data, error } = await supabase
    .from("users_profile")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
