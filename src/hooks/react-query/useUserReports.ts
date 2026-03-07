import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { toast } from "sonner";

export const useUserReports = (userId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    // Realtime subscription for this specific user's reports
    const channel = supabase
      .channel(`user-reports-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "crime_reports",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const oldStatus = (payload.old as any).status;
          const newStatus = (payload.new as any).status;

          // Only notify if status actually changed
          if (oldStatus !== newStatus) {
            queryClient.invalidateQueries({
              queryKey: ["user-reports", userId],
            });

            if (newStatus === "approved") {
              toast.success(
                "Good news! Your crime report has been verified and approved.",
                {
                  description:
                    "It is now visible on the secure intelligence map.",
                  duration: 6000,
                },
              );
            } else if (newStatus === "rejected") {
              toast.error(
                "Update: Your report was reviewed but could not be verified.",
                {
                  description:
                    "Please ensure all details and evidence are accurate.",
                  duration: 6000,
                },
              );
            }
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "crime_reports",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["user-reports", userId] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return useQuery({
    queryKey: ["user-reports", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crime_reports")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};
