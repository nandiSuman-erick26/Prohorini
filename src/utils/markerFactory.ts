import L from "leaflet";
import { MarkerMode } from "@/typeScript/types/global.type";

export const makeMarker = (mode: MarkerMode) => {
  if (mode === "search-pin") {
    return L.divIcon({
      className: "",
      html: `<div class="pin pin-wrap"></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
    });
  }

  if (mode === "user-alert") {
    return L.divIcon({
      className: "",
      html: ` <div class="cupid-wrap">
          <div class="cupid cupid-alert"></div>
          <div class="pulse"></div>
        </div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });
  }

  return L.divIcon({
    className: "",
    html: `<div class="cupid cupid-normal"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};
