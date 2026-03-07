import { API } from "@/lib/axios";

export const getThreatData = async (
  category: string,
  severity: number | "all",
  year: number
) => {
  const res = await API.get("/threat-data", {
    params: { category, severity, year },
  });

  return res.data;
};
