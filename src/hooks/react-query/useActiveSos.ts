import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/axios";

export const useActiveSos = () => {
  return useQuery({
    queryKey: ["activeSos"],
    queryFn: async () => {
      const { data } = await API.get("/admin/active-sos");
      return data;
    },
    refetchInterval: 5000,
  });
};
