"use client";

import React from "react";
import { GeoJSON, Marker, Tooltip } from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
import { getZones } from "@/services/api/zone.api";
import { getSafetyInfra } from "@/services/api/safetyInfra.api";
import { getSeverityColor } from "@/utils/severityColor";
import L from "leaflet";
import { ShieldCheck, Cross, Navigation } from "lucide-react";

// Helper to get Infrastructure Icons for the User
const getInfraIcon = (type: string) => {
  const colors: any = {
    police: "#1e40af", // Blue
    hospital: "#dc2626", // Red
    help_center: "#7c3aed", // Purple
  };

  return L.divIcon({
    className: "",
    html: `<div style="
      background: ${colors[type] || "#000"};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #fff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        ${
          type === "police"
            ? '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'
            : type === "hospital"
              ? '<path d="M12 6v12M6 12h12"/>'
              : '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'
        }
      </svg>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export const SafetyInfrastructureLayer = () => {
  // Fetch Zones (Threat/Safe/Routes)
  const { data: zones = [] } = useQuery({
    queryKey: ["zones"],
    queryFn: getZones,
  });

  // Fetch Fixed Infrastructure (Police/Hospitals)
  const { data: infra = [] } = useQuery({
    queryKey: ["infra"],
    queryFn: getSafetyInfra,
  });

  // Safely ensure data is an array
  const zonesList = Array.isArray(zones) ? zones : [];
  const infraList = Array.isArray(infra) ? infra : [];

  return (
    <>
      {/* 🏙️ Zones & Routes Layer */}
      {zonesList.map((zone: any) => (
        <GeoJSON
          key={zone.id}
          data={zone.geojson}
          style={() => {
            const baseStyle = getSeverityColor(zone.severity);
            if (zone.type === "exit_route") {
              return {
                color: "#10b981", // Emerald Green for routes
                weight: 6,
                dashArray: "10, 10",
                opacity: 0.8,
              };
            }
            if (zone.type === "safe_zone") {
              return {
                color: "#059669",
                fillColor: "#10b981",
                weight: 2,
                fillOpacity: 0.3,
              };
            }
            return baseStyle;
          }}
        >
          <Tooltip sticky direction="top">
            <div className="p-1">
              <strong className="text-zinc-900">{zone.name}</strong>
              <p className="text-[10px] uppercase font-bold text-zinc-500">
                {zone.type?.replace("_", " ")}
              </p>
            </div>
          </Tooltip>
        </GeoJSON>
      ))}

      {/* 📍 Infrastructure Markers */}
      {infraList.map((point: any) => (
        <Marker
          key={point.id}
          position={[point.lat, point.lng]}
          icon={getInfraIcon(point.type)}
        >
          <Tooltip direction="top" offset={[0, -10]}>
            <div className="p-1">
              <strong className="text-zinc-900">{point.name}</strong>
              <p className="text-[10px] text-zinc-500">{point.address}</p>
              {point.phone && (
                <p className="text-[10px] font-bold text-blue-600">
                  📞 {point.phone}
                </p>
              )}
            </div>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
};
