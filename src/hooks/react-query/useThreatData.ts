"use client";

import { useQuery } from "@tanstack/react-query";
import { getThreatData } from "@/services/api/threat.api";

export const useThreatData = (
  category: string,
  severity: number | "all",
  year: number,
) => {
  return useQuery({
    queryKey: ["threat-data", category, severity, year],
    queryFn: () => getThreatData(category, severity, year),
    staleTime: 1000 * 60 * 30, // 30 min cache
    refetchInterval: 1000 * 60 * 60, // 1 hour refetch
  });
};
