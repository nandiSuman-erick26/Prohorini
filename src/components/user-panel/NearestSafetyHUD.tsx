"use client";

import React, { useMemo } from "react";
import { useAppSelector } from "@/hooks/redux/store/rootRedux";
import { useQuery } from "@tanstack/react-query";
import { getSafetyInfra } from "@/services/api/safetyInfra.api";
import { getZones } from "@/services/api/zone.api";
import { findNearestSafetyPoint, checkInsideZone } from "@/utils/proximity";
import { Navigation, ShieldCheck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export const NearestSafetyHUD = () => {
  const { currentCoords } = useAppSelector((state) => state.userSafty);
  const { data: infra = [] } = useQuery({
    queryKey: ["infra"],
    queryFn: getSafetyInfra,
  });
  const { data: zones = [] } = useQuery({
    queryKey: ["zones"],
    queryFn: getZones,
  });

  // Find nearest infrastructure
  const nearestInfra = useMemo(() => {
    if (!currentCoords || !Array.isArray(infra) || infra.length === 0)
      return null;
    return findNearestSafetyPoint(currentCoords, infra);
  }, [currentCoords, infra]);

  // Check if user is currently in any zone
  const activeZone = useMemo(() => {
    if (!currentCoords || !Array.isArray(zones) || zones.length === 0)
      return null;
    return checkInsideZone(currentCoords, zones);
  }, [currentCoords, zones]);

  if (!currentCoords) return null;

  return (
    <div className="fixed top-1/2 -translate-y-1/2 left-4 flex flex-col gap-2 z-[900] max-w-[160px] md:max-w-xs pointer-events-none">
      {/* Current Zone Status */}
      {activeZone && (
        <div
          className={`px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-2 animate-in slide-in-from-left duration-500
          ${activeZone.type === "threat_zone" ? "bg-red-600/95 text-white" : "bg-emerald-600/95 text-white"}`}
        >
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] uppercase font-black opacity-80 leading-none mb-0.5">
              {activeZone.type?.replace("_", " ")}
            </span>
            <span className="text-[11px] font-bold leading-none truncate">
              {activeZone.name}
            </span>
          </div>
        </div>
      )}

      {/* Nearest Safety Point Card */}
      {nearestInfra && (
        <div className="bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-2xl border border-zinc-200/50 flex items-center gap-2 pointer-events-auto">
          <div
            className={cn(
              "p-1.5 rounded-lg shrink-0",
              nearestInfra.type === "police"
                ? "bg-blue-100 text-blue-600"
                : "bg-red-100 text-red-600",
            )}
          >
            {nearestInfra.type === "police" ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[9px] uppercase font-bold text-zinc-400 leading-none mb-0.5">
              Nearest {nearestInfra.type}
            </span>
            <span className="text-[11px] font-bold text-zinc-800 truncate leading-none">
              {nearestInfra.name}
            </span>
            <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-500 mt-1">
              <Navigation className="h-2 w-2" />
              <span>{nearestInfra.distance} km</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
