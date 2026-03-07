import { searchFunction } from "@/services/api/geoCode.api";
import { useQuery } from "@tanstack/react-query";

export const useGeoSearch = (query: string) => {
  return useQuery({
    queryKey: ["geoSearch", query],
    queryFn: () => searchFunction(query),
    enabled: query.length > 2,
  });
};
