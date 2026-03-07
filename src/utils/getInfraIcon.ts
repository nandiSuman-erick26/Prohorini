import L from "leaflet";

export const getInfraIcon = (type: string) => {
  const colors: Record<string, string> = {
    police: "blue",
    hospital: "green",
    help_center: "purple",
    draft: "#000000",
  };
  const background = colors[type] ?? " #000000";
  return L.divIcon({
    className: "",
    html: `<div style="
  background:${background};
  width:16px;
  height:16px;
  border-radius:50%;
  border: 2px solid #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,.4);
  "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};
