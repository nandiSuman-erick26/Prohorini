import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApprovedReports } from "@/services/api/reports.api";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";

export const useApprovedReports = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Realtime subscription for all approved reports (for the map)
    const channel = supabase
      .channel("approved-reports-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "crime_reports",
        },
        () => {
          // Since we can't easily filter realtime by status 'approved' in some Supabase configs,
          // we invalidate and let React Query handle the fresh fetch.
          queryClient.invalidateQueries({
            queryKey: ["crime-reports-approved"],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["crime-reports-approved"],
    queryFn: getApprovedReports,
    staleTime: 1000 * 60 * 5, // 5 min cache for static, but realtime overrides this
  });
};
