import { supabase } from "../supabaseClient";

export async function fetchUserProfile(clerk_id: string) {
  const { data, error } = await supabase
    .from("users_profile")
    .select("*")
    .eq("clerk_id", clerk_id);
  if (error) throw error;
  console.log("clerk_id", clerk_id);
  return data && data.length > 0 ? data[0] : null;
}
  