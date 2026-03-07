import { API } from "@/lib/axios";

export const getZones = async () => {
  console.log("api calling")
  const { data } = await API.get("/admin/threat-zones");
  return data;
};

export const createZone = async (payload: any) => {
  console.log("AXIOS SENDING", payload);
  
  const { data } = await API.post("/admin/threat-zones", payload);
  return data;
};

export const updateZone = async ({id, geojson, severity}: any)=>{
  const {data} = await API.patch("/admin/threat-zones", {id, geojson, severity});
  return data;
}

export const deleteZone = async (id: string) => {
  const { data } = await API.delete("/admin/threat-zones/", { data: { id } });
  return data;
};
