import { useQuery } from "@tanstack/react-query";
import { useProfile } from "./useProfile";
import { supabase } from "@/lib/supabaseClient";

export const useEmergencyContacts = () => {
  const { data: circle_profile } = useProfile();

  return useQuery({
    queryKey: ["circle-contacts", circle_profile?.id],
    enabled: !!circle_profile,
    queryFn: async () => {
      const { data } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", circle_profile?.id);

      return data ?? [];
    },
  });
};
