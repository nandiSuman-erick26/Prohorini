"use client";

import React from "react";
import { GeoJSON, Tooltip } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import { cn } from "@/lib/utils";

interface EscapeRouteLayerProps {
  routeData: FeatureCollection;
  destinationName: string;
  distanceKm: string;
  etaMins: string;
  isEmergency?: boolean;
  travelMode?: string;
}

export const EscapeRouteLayer = ({
  routeData,
  destinationName,
  distanceKm,
  etaMins,
  isEmergency = true,
  travelMode = "walking",
}: EscapeRouteLayerProps) => {
  return (
    <GeoJSON
      key={JSON.stringify(routeData) + travelMode}
      data={routeData}
      style={() => ({
        color: isEmergency ? "#10b981" : "#3b82f6",
        weight: isEmergency ? 6 : 5,
        opacity: 0.9,
        dashArray: isEmergency ? "12, 8" : "1, 0",
        lineCap: "round",
        lineJoin: "round",
      })}
    >
      <Tooltip sticky direction="top">
        <div className="p-2 min-w-[120px]">
          <strong
            className={cn(
              "text-xs block mb-1",
              isEmergency ? "text-emerald-700" : "text-blue-700",
            )}
          >
            {isEmergency ? "🛡️ Safe Route" : "📍 Navigation"} →{" "}
            {destinationName}
          </strong>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-black uppercase tracking-wider">
            <span>{distanceKm} km</span>
            <span className="h-1 w-1 bg-zinc-300 rounded-full" />
            <span>
              ~{etaMins} min {travelMode}
            </span>
          </div>
        </div>
      </Tooltip>
    </GeoJSON>
  );
};
