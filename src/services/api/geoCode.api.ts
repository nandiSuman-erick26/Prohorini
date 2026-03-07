import { GeoResult } from "@/typeScript/types/global.type";
import axios from "axios";

export const searchFunction = async (q: string): Promise<GeoResult[]> => {
  if (!q) return [];

  const res = await axios.get<GeoResult[]>(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        format: "json",
        q,
        limit: 5,
      },
      headers: {
        // good practice for nominatim
        Accept: "application/json",
      },
    },
  );

  return res.data;
};
