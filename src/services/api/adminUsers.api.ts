import { API } from "@/lib/axios";

export const toggleUserActive = async (
  targetClerkId: string,
  is_active: boolean,
) => {
  const { data } = await API.post("/admin/toggle-user", {
    targetClerkId,
    is_active,
  });
  return data;
};

export const verifyUser = async (
  targetClerkId: string,
  is_verified: boolean,
) => {
  const { data } = await API.post("/admin/verify-user", {
    targetClerkId,
    is_verified,
  });
  return data;
};
