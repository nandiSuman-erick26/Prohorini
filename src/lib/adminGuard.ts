import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "./supabaseAdmin";

export const requireSuperAdmin = async () => {
  const admin = await currentUser();

  if (!admin) throw new Error("Unauthorized");
  const { data: admin_superAdmin } = await supabaseAdmin
    .from("users_profile")
    .select("role")
    .eq("clerk_id", admin?.id)
    .single();

  if (admin_superAdmin?.role !== "ADMIN") throw new Error("Forbidden");

  return { supabase: supabaseAdmin, admin_superAdmin };
};
