"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/axios";
import {
  Loader2,
  Flame,
  Shield,
  Building2,
  Layers,
  Eye,
  EyeOff,
  Activity,
  MapPin,
  TriangleAlert,
  Crosshair,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const IntelligenceMap = dynamic(
  () => import("@/components/admin-panel/intelligence/IntelligenceMap"),
  { ssr: false },
);

type MapStyle = "dark" | "street" | "satellite";

const IntelligencePage = () => {
  const [layers, setLayers] = useState({
    heatmap: true,
    reports: true,
    zones: true,
    infra: true,
  });
  const [mapType, setMapType] = useState<MapStyle>("dark");

  const { data, isLoading, error } = useQuery({
    queryKey: ["intelligenceMapData"],
    queryFn: async () => {
      const { data } = await API.get("/admin/intelligence-map");
      return data;
    },
    refetchInterval: 60000,
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-zinc-950 rounded-3xl">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-red-500" />
            <div className="absolute inset-0 h-10 w-10 bg-red-500/20 blur-xl rounded-full animate-pulse" />
          </div>
          <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">
            Initializing Intelligence Grid...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-red-500 font-black uppercase text-sm">
          Failed to load intelligence data. Check API connection.
        </p>
      </div>
    );
  }

  const summary = data?.summary || {};

  const layerControls = [
    {
      key: "heatmap" as const,
      label: "Crime Heatmap",
      icon: Flame,
      color: "text-red-500",
      activeBg: "bg-red-500/10 border-red-500/30",
      count: summary.totalHeatPoints || 0,
      unit: "data points",
    },
    {
      key: "reports" as const,
      label: "User Reports",
      icon: FileText,
      color: "text-amber-500",
      activeBg: "bg-amber-500/10 border-amber-500/30",
      count: summary.totalReports || 0,
      unit: "reports",
    },
    {
      key: "zones" as const,
      label: "Threat Zones",
      icon: TriangleAlert,
      color: "text-orange-500",
      activeBg: "bg-orange-500/10 border-orange-500/30",
      count: summary.totalZones || 0,
      unit: "zones",
    },
    {
      key: "infra" as const,
      label: "Safety Points",
      icon: Building2,
      color: "text-emerald-500",
      activeBg: "bg-emerald-500/10 border-emerald-500/30",
      count: summary.totalInfra || 0,
      unit: "locations",
    },
  ];

  const infraBreakdown = [
    {
      label: "Police Stations",
      count: summary.policeStations || 0,
      color: "bg-blue-500",
    },
    {
      label: "Hospitals",
      count: summary.hospitals || 0,
      color: "bg-emerald-500",
    },
    {
      label: "Help Centers",
      count: summary.helpCenters || 0,
      color: "bg-purple-500",
    },
  ];

  const mapStyles: { key: MapStyle; label: string }[] = [
    { key: "dark", label: "Dark" },
    { key: "street", label: "Street" },
    { key: "satellite", label: "Satellite" },
  ];

  return (
    <div className="flex gap-0 h-[calc(100vh-64px-2rem)] -m-8 p-0 overflow-hidden">
      {/* ─── LEFT: Full Map ─── */}
      <div className="flex-1 relative min-w-0">
        <IntelligenceMap
          heatPoints={data?.heatPoints || []}
          reportMarkers={data?.reportMarkers || []}
          threatZones={data?.threatZones || []}
          safetyInfra={data?.safetyInfra || []}
          layers={layers}
          mapType={mapType}
        />

        {/* ─── Floating Map Type Switch ─── */}
        <div className="absolute top-4 right-4 z-[1000] flex gap-1 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-1">
          {mapStyles.map((style) => (
            <button
              key={style.key}
              onClick={() => setMapType(style.key)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                mapType === style.key
                  ? "bg-white text-black shadow-lg"
                  : "text-zinc-400 hover:text-white",
              )}
            >
              {style.label}
            </button>
          ))}
        </div>

        {/* ─── Floating Status Bar ─── */}
        <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-3 px-4 py-2 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-full">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            Live Intelligence Feed • {summary.totalHeatPoints || 0} Heat Points
            • {summary.totalReports || 0} Reports
          </span>
        </div>
      </div>

      {/* ─── RIGHT: Intelligence Panel ─── */}
      <div className="w-[320px] bg-zinc-950 border-l border-white/5 flex flex-col overflow-hidden shrink-0">
        {/* Panel Header */}
        <div className="px-6 py-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-red-500/10 rounded-xl flex items-center justify-center">
              <Crosshair className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-tight">
                Intelligence Hub
              </h2>
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                Unified Situation Room
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-6 space-y-8">
          {/* ─── Layer Controls ─── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-3 w-3 text-zinc-600" />
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                Active Layers
              </span>
            </div>
            {layerControls.map((layer) => {
              const Icon = layer.icon;
              const isActive = layers[layer.key];
              return (
                <button
                  key={layer.key}
                  onClick={() => toggleLayer(layer.key)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 group",
                    isActive
                      ? layer.activeBg
                      : "bg-zinc-900/50 border-zinc-800/50 opacity-50",
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                      isActive ? "bg-white/10" : "bg-zinc-800",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        isActive ? layer.color : "text-zinc-600",
                      )}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p
                      className={cn(
                        "text-xs font-black uppercase tracking-tight",
                        isActive ? "text-white" : "text-zinc-500",
                      )}
                    >
                      {layer.label}
                    </p>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                      {layer.count} {layer.unit}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {isActive ? (
                      <Eye className="h-4 w-4 text-white/50" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-zinc-700" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ─── Infrastructure Breakdown ─── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3 text-zinc-600" />
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                Infrastructure Detail
              </span>
            </div>
            <div className="space-y-2">
              {infraBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn("h-2.5 w-2.5 rounded-full", item.color)}
                    />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-black text-white">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Map Legend ─── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-zinc-600" />
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                Threat Heat Legend
              </span>
            </div>
            <div className="flex items-center gap-1 h-4 rounded-full overflow-hidden">
              <div className="flex-1 h-full bg-blue-500 rounded-l-full" />
              <div className="flex-1 h-full bg-cyan-400" />
              <div className="flex-1 h-full bg-yellow-400" />
              <div className="flex-1 h-full bg-orange-500" />
              <div className="flex-1 h-full bg-red-500 rounded-r-full" />
            </div>
            <div className="flex justify-between">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                Low Risk
              </span>
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                Critical
              </span>
            </div>
          </div>

          {/* ─── Zone Severity Legend ─── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-zinc-600" />
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                Zone Severity
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { level: 1, color: "#22c55e", label: "Safe" },
                { level: 2, color: "#eab308", label: "Low" },
                { level: 3, color: "#f97316", label: "Med" },
                { level: 4, color: "#ea580c", label: "High" },
                { level: 5, color: "#dc2626", label: "Crit" },
              ].map((sev) => (
                <div
                  key={sev.level}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className="h-6 w-6 rounded-lg border-2"
                    style={{
                      borderColor: sev.color,
                      backgroundColor: sev.color + "33",
                    }}
                  />
                  <span className="text-[7px] font-black text-zinc-500 uppercase">
                    {sev.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Footer */}
        <div className="px-5 py-4 border-t border-white/5 shrink-0">
          <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] text-center">
            Auto-Sync Every 60s • Real-Time Feed
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntelligencePage;
