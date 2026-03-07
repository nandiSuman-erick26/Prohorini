

import { API } from "@/lib/axios";

export const getSafetyInfra = async () => {
  const { data } = await API.get("/admin/safety-infra");
  return data;
};

export const createSafetyInfra = async (payload: any) => {
  const { data } = await API.post("/admin/safety-infra", payload);
  return data;
};

export const updateSaftyinfra = async (payload: any) => {
  const res = await API.patch("/admin/safety-infra", payload);
  return res.data;
}

export const deleteSafetyInfra = async (id: string) => {
  const { data } = await API.delete("/admin/safety-infra", { data: { id } });
  return data;
};
