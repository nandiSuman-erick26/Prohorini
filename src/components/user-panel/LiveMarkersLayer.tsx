"use client";

import { Marker, Popup } from "react-leaflet";
import { useAppSelector } from "@/hooks/redux/store/rootRedux";
import { makeMarker } from "@/utils/markerFactory";

export const LiveMarkersLayer = () => {
  const { circleLiveLocations } = useAppSelector((state) => state.userSafty);

  return (
    <>
      {Object.values(circleLiveLocations).map((member) => {
        const { userId, coords, isSosActive } = member;

        // 🚨 Safety Check: Ensure coordinates are valid before rendering Marker
        if (
          !coords ||
          typeof coords.lat !== "number" ||
          typeof coords.lng !== "number"
        ) {
          return null;
        }

        return (
          <Marker
            key={userId}
            position={[coords.lat, coords.lng]}
            icon={makeMarker(
              isSosActive ? "user-alert" : ("user-marker" as any),
            )}
          >
            <Popup>
              <div className="text-center">
                <p className="font-bold text-sm">
                  {isSosActive ? "🚨 SOS ACTIVE" : "📍 Live Location"}
                </p>
                <p className="text-xs text-zinc-500">
                  Updated: {new Date(coords.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
