import { useQuery } from "@tanstack/react-query";
import { getSafetyLogs } from "@/services/api/adminLogs.api";

export const useAdminLogs = () => {
  return useQuery({
    queryKey: ["adminLogs"],
    queryFn: getSafetyLogs,
    refetchInterval: 5000, // Refresh every 5 seconds for real-time monitoring
  });
};
