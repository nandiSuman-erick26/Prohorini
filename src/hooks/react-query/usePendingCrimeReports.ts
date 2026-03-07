import { supabase } from "@/lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useFetchCrimeReports = () => {
  const queryClient = useQueryClient();

  // Supabase Realtime: refetch whenever any row in crime_reports changes
  useEffect(() => {
    const channel = supabase
      .channel("crime_reports_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "crime_reports" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["crime-reports"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["crime-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crime_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 30, // 30 seconds — keeps data fresh without hammering the DB
    refetchInterval: 1000 * 30,
  });
};
