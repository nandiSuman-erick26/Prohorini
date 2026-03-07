import { API } from "@/lib/axios";

export const getSafetyLogs = async () => {
  const { data } = await API.get("/admin/safety-logs");
  return data;
};
