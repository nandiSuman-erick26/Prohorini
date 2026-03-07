"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import ProhoriniShieldLoader from "@/components/ui/loaders/ProhoriniShieldLoader";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMapTarget } from "@/hooks/context/mapTargetContext";
import { LiveMapProps, Pos } from "@/typeScript/types/global.type";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import { makeMarker } from "@/utils/markerFactory";
import { motion, AnimatePresence } from "framer-motion";
// import { getThreatData } from "@/services/api/threat.api";
// import { generateDensityGrid } from "@/utils/heatMapDensity";

import ThreatHeatMapLayer from "@/components/ThreatHeatMapLayer";
import { useLocationSharing } from "@/hooks/utils/useLocationSharing";
import { useCircleLiveLocations } from "@/hooks/utils/useLiveLocationSubscription";
import { LiveMarkersLayer } from "./LiveMarkersLayer";
import { SafetyActionBar } from "./SafetyActionBar";
import { MapFilters } from "./MapFilters";
import { useThreatData } from "@/hooks/react-query/useThreatData";
import {
  Loader2,
  Zap,
  ShieldAlert,
  LayoutGrid,
  Shield,
  Megaphone,
  Route,
  X,
  Car,
  Footprints,
  Bike,
  Navigation,
  Radar,
} from "lucide-react";
import * as turf from "@turf/turf";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CrimeClusterLayer from "./CrimeClusterLayer";
import { CrimeGridLayer } from "./CrimeGridLayer";
import { useApprovedReports } from "@/hooks/react-query/useApprovedReports";
import LocationSearch from "./LocationSearch";
import { SafetyInfrastructureLayer } from "./SafetyInfrastructureLayer";
import { NearestSafetyHUD } from "./NearestSafetyHUD";
import MapType from "../MapType";
import CrimeReportModal from "./CrimeReportModal";
import { EscapeRouteLayer } from "./EscapeRouteLayer";
import { checkInsideZone, findNearestSafetyPoint } from "@/utils/proximity";
import {
  fetchRoute,
  type TravelMode,
  type RouteResult,
} from "@/utils/fetchEscapeRoute";
import { getSafetyInfra } from "@/services/api/safetyInfra.api";
import { getZones } from "@/services/api/zone.api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  startSharingSession,
  stopSharingSession,
  triggerSos,
  clearSos,
} from "@/hooks/redux/redux-slices/userSafetySlice";

const TILE_MAPS = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  topo: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
};

const DynamicTileLayer = ({ mapType }: { mapType: keyof typeof TILE_MAPS }) => {
  const map = useMap();

  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    const tileUrl = TILE_MAPS[mapType];
    if (!tileUrl || !map) return;

    const tileLayer = L.tileLayer(tileUrl);
    tileLayer.addTo(map);

    return () => {
      if (map.hasLayer(tileLayer)) {
        map.removeLayer(tileLayer);
      }
    };
  }, [mapType, map]);

  return null;
};

/* -------------------- Leaflet Icon Fix -------------------- */
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* -------------------- Map Bounds Listener -------------------- */
function MapBoundsListener({
  onChange,
}: {
  onChange: (bbox: [number, number, number, number], zoom: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const updateBounds = () => {
      const b = map.getBounds();
      onChange(
        [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
        map.getZoom(),
      );
    };

    updateBounds();
    map.on("moveend", updateBounds);
    map.on("zoomend", updateBounds);

    return () => {
      map.off("moveend", updateBounds);
      map.off("zoomend", updateBounds);
    };
  }, [map, onChange]);

  return null;
}

/* -------------------- Recenter On Initial Load -------------------- */
function Recenter({ pos }: { pos: Pos }) {
  const map = useMap();

  useEffect(() => {
    map.setView([pos.lat, pos.lng], 15);
  }, []); // run once

  return null;
}

/* -------------------- Fly To Search Target -------------------- */
function Flyto({
  target = null,
  currentPos = null,
}: {
  target: Pos | null;
  currentPos: Pos | null;
}) {
  const map = useMap();
  const prevTarget = useRef(target);

  useEffect(() => {
    // Only trigger if target actually changed
    if (target && target !== prevTarget.current) {
      map.flyTo([target.lat, target.lng], 15, {
        animate: true,
        duration: 1.5,
      });
    } else if (prevTarget.current && !target && currentPos) {
      // User cleared the search, fly back to current location
      map.flyTo([currentPos.lat, currentPos.lng], 15, {
        animate: true,
        duration: 1.5,
      });
    }
    prevTarget.current = target;
  }, [target, map]); // Removed currentPos from dependencies to stop shaking on user move

  return null;
}

const LiveMap = () => {
  const dispatch = useAppDispatch();
  const { target, setTarget } = useMapTarget();
  const { userProfile } = useAppSelector((state) => state.userProfile);
  const { currentCoords, smartGeofencingEnabled, safetyStatus } =
    useAppSelector((state) => state.userSafty);
  const { mapType } = useAppSelector((state) => state.adminMap);
  const [mounted, setMounted] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize sharing and subscription
  useLocationSharing(userProfile?.id || null);
  useCircleLiveLocations(userProfile?.id || null);

  const [zoom, setZoom] = useState<number>(15);
  const [bbox, setBbox] = useState<[number, number, number, number] | null>(
    null,
  );

  // --- Search/Filter State ---
  const [category, setCategory] = useState<string>("all");
  const [year, setYear] = useState<number>(2023);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [showHeatMap, setShowHeatMap] = useState<boolean>(true);
  const [showClusters, setShowClusters] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showThreatZones, setShowThreatZones] = useState<boolean>(true);
  const [radiusKm, setRadiusKm] = useState<number>(0);

  const { data: approvedReports, isLoading: isReportsLoading } =
    useApprovedReports();

  // Fetch Threat Data
  const { data: fetchedThreatData, isLoading: isThreatLoading } = useThreatData(
    category,
    severityFilter === "all" ? "all" : Number(severityFilter),
    year,
  );

  // Fetch Threat Zones Polygons (Real-time Detection)
  const { data: threatZones = [] } = useQuery({
    queryKey: ["zones"],
    queryFn: getZones,
  });

  // --- Alert State ---
  const [alertOpen, setAlertOpen] = useState(false);
  const [detectedZone, setDetectedZone] = useState<any>(null);
  const [lastZoneId, setLastZoneId] = useState<string | null>(null);
  const [isSendingAlert, setIsSendingAlert] = useState(false);

  // --- Escape/General Route State ---
  const [showEscapeButton, setShowEscapeButton] = useState(false);
  const [escapeRoute, setEscapeRoute] = useState<RouteResult | null>(null);
  const [escapeDestination, setEscapeDestination] = useState<string>("");
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [travelMode, setTravelMode] = useState<TravelMode>("walking");
  const [isEmergencyRoute, setIsEmergencyRoute] = useState(false);

  // Fetch infrastructure for escape route calculation
  const { data: infraData = [] } = useQuery({
    queryKey: ["infra"],
    queryFn: getSafetyInfra,
  });

  // Track which zones have already been 'notified' during this session to prevent repeat alerts on refresh
  const notifiedZonesRef = useRef<Set<string>>(new Set());

  // 🚨 SMART GEOFENCING LOGIC (Hardened for Refresh)
  useEffect(() => {
    if (!smartGeofencingEnabled || !currentCoords) return;

    // Wait for threat zones to fully load
    if (!threatZones || threatZones.length === 0) {
      console.log("[Geofence] Waiting for threat zones data...");
      return;
    }

    const insideZone = checkInsideZone(currentCoords, threatZones);

    // DEBUG: Only log if coordinates actually changed
    console.log(
      `[Geofence] Checking ${currentCoords.lat}, ${currentCoords.lng}. Inside: ${insideZone?.name || "None"}`,
    );

    if (insideZone?.id) {
      // If we are already tracking this specific zone, no need to re-detect
      if (insideZone.id === lastZoneId) return;

      console.log(
        `[Geofence] Zone Change Detected: ${lastZoneId || "None"} -> ${insideZone.id}`,
      );
      setLastZoneId(insideZone.id);

      // Only trigger safety modal if it's a threat zone AND we haven't shown it yet in this mount
      if (
        insideZone.type === "threat_zone" &&
        !notifiedZonesRef.current.has(insideZone.id)
      ) {
        console.log(
          `[Geofence] 🚨 THREAT DETECTED in "${insideZone.name}". Launching Modal.`,
        );
        setDetectedZone(insideZone);
        setAlertOpen(true);
        notifiedZonesRef.current.add(insideZone.id);
      }
    } else {
      // Reset tracker when leaving all zones
      if (lastZoneId !== null) {
        console.log("[Geofence] Left all zones. Resetting tracker.");
        setLastZoneId(null);
        // Clear escape route when leaving all zones
        setShowEscapeButton(false);
        setEscapeRoute(null);
        setEscapeDestination("");
      }
    }
  }, [
    currentCoords?.lat,
    currentCoords?.lng,
    threatZones,
    smartGeofencingEnabled,
    lastZoneId,
  ]);

  const handleGetDirections = async (
    dest: { lat: number; lng: number } | null,
    mode: TravelMode,
    isEmergency: boolean,
    label?: string,
  ) => {
    if (!currentCoords || !dest) return;
    setIsLoadingRoute(true);
    setIsEmergencyRoute(isEmergency);
    try {
      const route = await fetchRoute(currentCoords, dest, mode);
      setEscapeRoute(route);
      setEscapeDestination(label || "Search Target");
      toast.success(
        `Route calculated: ${(route.distance / 1000).toFixed(1)} km, ~${Math.ceil(route.duration / 60)} min.`,
      );
    } catch (err) {
      console.error("[Routing] Failed:", err);
      toast.error("Failed to calculate route.");
    } finally {
      setIsLoadingRoute(false);
    }
  };

  const handleSendAlert = async () => {
    if (!currentCoords || !detectedZone) return;
    setIsSendingAlert(true);
    try {
      const now = new Date();
      const expires = new Date(now.getTime() + 60 * 60 * 1000);

      dispatch(
        startSharingSession({
          startedAt: now.toISOString(),
          expiresAt: expires.toISOString(),
        }),
      );
      dispatch(triggerSos());

      const res = await fetch("/api/safety/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zoneName: detectedZone.name,
          lat: currentCoords.lat,
          lng: currentCoords.lng,
        }),
      });

      if (!res.ok) throw new Error("Failed to dispatch alert");

      setAlertOpen(false);
      setShowEscapeButton(true);
      toast.error(
        "Emergency Mode Activated: Your circle has been notified and live tracking is ON.",
        {
          duration: 10000,
          position: "top-center",
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("Alert dispatch failed, but local SOS mode is active.");
      setShowEscapeButton(true);
    } finally {
      setIsSendingAlert(false);
    }
  };

  // Combine historical and live data
  const combinedPoints = useMemo(() => {
    const historical = fetchedThreatData?.ok ? fetchedThreatData.data : [];

    // Anonymized/Aggregated live reports (Always visible)
    const live = (approvedReports || []).map((r: any) => ({
      lat: Number(r.lat),
      lng: Number(r.lng),
      severity: r.severity || 3, // Defaults to 3 if not provided
      category: r.type,
      isLive: true,
    }));

    return [...historical, ...live];
  }, [fetchedThreatData, approvedReports]);

  // Transform data for Heatmap: Array of [lat, lng, intensity]
  const heatMapData = useMemo(() => {
    let rawPoints = combinedPoints;

    // Filter by category if not "all"
    if (category !== "all") {
      rawPoints = rawPoints.filter(
        (p: any) =>
          p.category === category ||
          (p.categoryWeight && p.category === category),
      );
    }

    // Apply Turf.js Radius Filter if set
    if (radiusKm > 0 && currentCoords) {
      const userPoint = turf.point([currentCoords.lng, currentCoords.lat]);
      rawPoints = rawPoints.filter((p: any) => {
        const crimePoint = turf.point([p.lng, p.lat]);
        const distance = turf.distance(userPoint, crimePoint, {
          units: "kilometers",
        });
        return distance <= radiusKm;
      });
    }

    return rawPoints.map((p: any) => [
      p.lat,
      p.lng,
      (p.severity || 1) / 5, // Normalize intensity for leaflet-heat (0 to 1)
    ]);
  }, [combinedPoints, radiusKm, currentCoords, category]);

  const rawThreatData = useMemo(() => {
    let raw = combinedPoints;

    // Filter by category
    if (category !== "all") {
      raw = raw.filter(
        (p: any) =>
          p.category === category ||
          (p.categoryWeight && p.category === category),
      );
    }

    // Apply radius filter
    if (radiusKm > 0 && currentCoords) {
      const userPoint = turf.point([currentCoords.lng, currentCoords.lat]);
      raw = raw.filter((p: any) => {
        const crimePoint = turf.point([p.lng, p.lat]);
        const distance = turf.distance(userPoint, crimePoint, {
          units: "kilometers",
        });
        return distance <= radiusKm;
      });
    }

    return raw;
  }, [combinedPoints, category, radiusKm, currentCoords]);

  const handleBoundChange = useCallback(
    (b: [number, number, number, number], z: number) => {
      setBbox(b);
      setZoom(z);
    },
    [],
  );

  // Default position if no coords yet
  const defaultPos: Pos = { lat: 23.8103, lng: 90.4125 };
  const finalPos = currentCoords
    ? { lat: currentCoords.lat, lng: currentCoords.lng }
    : defaultPos;

  if (!mounted || !currentCoords) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-950">
        <ProhoriniShieldLoader message="Locking GPS Coordinates..." />
      </div>
    );
  }

  /* -------------------- Render Map -------------------- */
  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[23.8103, 90.4125]} // Initial static center, Recenter/Flyto handles movements
        zoom={15}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
      >
        <DynamicTileLayer mapType={mapType as keyof typeof TILE_MAPS} />

        <MapBoundsListener onChange={handleBoundChange} />

        {/* User Marker */}
        <Marker
          position={[finalPos.lat, finalPos.lng]}
          icon={makeMarker(
            safetyStatus === "sos" ? "user-alert" : "user-marker",
          )}
        />

        {/* Search Target Marker */}
        {target && (
          <Marker
            position={[target.lat, target.lng]}
            icon={makeMarker("search-pin")}
          />
        )}

        {/* Safety Heatmap Overlay */}
        {showHeatMap && heatMapData.length > 0 && (
          <ThreatHeatMapLayer data={heatMapData} />
        )}

        {/* Crime Clusters Layer */}
        {showClusters && rawThreatData.length > 0 && (
          <CrimeClusterLayer data={rawThreatData} />
        )}

        {/* Region-based Grid Layer */}
        {showGrid && rawThreatData.length > 0 && bbox && (
          <CrimeGridLayer data={rawThreatData} bbox={bbox} />
        )}

        {/* Safety Infrastructure (Police, Hospitals, Safe Zones, Routes) */}
        {showThreatZones && <SafetyInfrastructureLayer />}

        {/* Live Markers for Circle Members */}
        <LiveMarkersLayer />

        {/* 🛡️ Dynamic Route Layer */}
        {escapeRoute && (
          <EscapeRouteLayer
            routeData={escapeRoute.geometry}
            destinationName={escapeDestination}
            distanceKm={(escapeRoute.distance / 1000).toFixed(1)}
            etaMins={Math.ceil(escapeRoute.duration / 60).toString()}
            isEmergency={isEmergencyRoute}
            travelMode={travelMode}
          />
        )}

        <Recenter pos={finalPos} />
        <Flyto target={target} currentPos={finalPos} />
      </MapContainer>

      {/* 🔍 TOP CENTER: Search & Filter HUD */}
      <div
        className={cn(
          "fixed left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[10000] w-full px-4 md:max-w-4xl transition-all duration-500 pointer-events-none",
          safetyStatus === "sos" ? "top-32" : "top-20",
        )}
      >
        {/* Search Bar */}
        <div className="w-full max-w-sm md:max-w-md shadow-xl pointer-events-auto">
          <LocationSearch
            onSelect={(lat, lng) => {
              setTarget({ lat, lng });
              setEscapeRoute(null); // Clear previous route
            }}
            onClear={() => {
              setTarget(null);
              setEscapeRoute(null);
            }}
          />
        </div>

        {/* Filters Scrollable Row */}
        <div className="w-full overflow-x-auto no-scrollbar flex justify-start md:justify-center pb-1 pointer-events-auto">
          <div className="flex items-center gap-1.5 w-max px-2">
            <MapFilters
              category={category}
              setCategory={setCategory}
              year={year}
              setYear={setYear}
              severity={severityFilter}
              setSeverity={setSeverityFilter}
              radiusKm={radiusKm}
              setRadiusKm={setRadiusKm}
              onClear={() => {
                setCategory("all");
                setYear(2023);
                setSeverityFilter("all");
                setRadiusKm(0);
                setShowHeatMap(true);
                setShowClusters(false);
                setShowGrid(false);
                setShowThreatZones(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* 📊 RIGHT SIDE: Controls Vertical Toolbar */}
      <div className="fixed top-60 right-4 flex flex-col gap-3 z-[1000]">
        <MapType />

        <div className="flex flex-col gap-2 items-center">
          {[
            {
              icon: Zap,
              label: "Heat",
              state: showHeatMap,
              setter: () => {
                setShowHeatMap(!showHeatMap);
                setShowClusters(false);
                setShowGrid(false);
              },
              color: "bg-yellow-500",
              fill: true,
            },
            {
              icon: ShieldAlert,
              label: "Alerts",
              state: showClusters,
              setter: () => {
                setShowClusters(!showClusters);
                setShowHeatMap(false);
                setShowGrid(false);
              },
              color: "bg-red-500",
            },
            {
              icon: LayoutGrid,
              label: "Grid",
              state: showGrid,
              setter: () => {
                setShowGrid(!showGrid);
                setShowHeatMap(false);
                setShowClusters(false);
              },
              color: "bg-blue-500",
            },
            {
              icon: Shield,
              label: "Infrastructure",
              state: showThreatZones,
              setter: () => setShowThreatZones(!showThreatZones),
              color: "bg-emerald-500",
              fill: true,
            },
            {
              icon: Megaphone,
              label: "Report Crime",
              state: reportModalOpen,
              setter: () => setReportModalOpen(true),
              color: "bg-orange-600",
              fill: true,
            },
          ].map((tool, idx) => (
            <Button
              key={idx}
              onClick={tool.setter}
              variant="outline"
              size="icon"
              className={cn(
                "h-9 w-9 md:h-10 md:w-10 rounded-xl shadow-lg transition-all duration-300",
                tool.state
                  ? `${tool.color} border-transparent text-white`
                  : "bg-white/90 backdrop-blur-md border-zinc-200 text-zinc-500 hover:bg-white",
              )}
            >
              <tool.icon
                className={cn(
                  "h-4 w-4 md:h-5 md:w-5",
                  tool.state && tool.fill && "fill-current",
                )}
              />
            </Button>
          ))}
        </div>
      </div>

      {/* Analysis Status Banner */}
      {(isThreatLoading || isReportsLoading) && (
        <div className="fixed top-4 left-4 z-[1001] bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[9px] font-black flex items-center gap-2 border border-white/10 shadow-2xl">
          <Loader2 className="h-3 w-3 animate-spin text-yellow-400" />
          ANALYZING...
        </div>
      )}

      {/* Real-time Proximity Alerts HUD */}
      <NearestSafetyHUD />

      {/* 🧭 ROUTE ACTION SIDEBAR (Left Side Stacking) - Refined Positioning */}
      <div className="fixed bottom-40 left-4 z-[1001] flex flex-col items-start gap-2 w-max pointer-events-none">
        {/* Search Target Action */}
        {target && !escapeRoute && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="pointer-events-auto"
          >
            <Button
              onClick={() =>
                handleGetDirections(target, travelMode, false, "Target Point")
              }
              disabled={isLoadingRoute}
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-black rounded-full w-10 h-10 md:w-auto md:px-6 md:h-12 shadow-2xl border border-white/10 flex items-center justify-center md:justify-start gap-2 group transition-all"
            >
              {isLoadingRoute ? (
                <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4 md:h-5 md:w-5 fill-white group-hover:rotate-12 transition-transform" />
              )}
              <span className="hidden md:block text-xs uppercase tracking-widest">
                Get Directions
              </span>
            </Button>
          </motion.div>
        )}

        {/* Emergency Safe Path Action */}
        {showEscapeButton && !alertOpen && !escapeRoute && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="pointer-events-auto"
          >
            <Button
              onClick={() => {
                const nearest = findNearestSafetyPoint(
                  currentCoords,
                  infraData,
                );
                if (nearest) {
                  handleGetDirections(
                    nearest,
                    "walking",
                    true,
                    nearest.name || nearest.type,
                  );
                }
              }}
              disabled={isLoadingRoute}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-full w-10 h-10 md:w-auto md:px-6 md:h-12 shadow-2xl shadow-emerald-500/20 border-2 border-emerald-400/30 transition-all flex items-center justify-center md:justify-start gap-2"
            >
              {isLoadingRoute ? (
                <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
              ) : (
                <Route className="h-4 w-4 md:h-5 md:w-5" />
              )}
              <span className="hidden md:block text-xs uppercase tracking-widest">
                Safe Path
              </span>
            </Button>
          </motion.div>
        )}
      </div>

      {/* 🧭 ELITE NAVIGATION HUD (Optimized Bottom Placement) */}
      {escapeRoute && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 z-[10005] w-[calc(100vw-32px)] md:w-80 bg-white/98 backdrop-blur-2xl border border-zinc-200 rounded-[28px] md:rounded-[32px] p-3 md:p-5 shadow-[0_30px_70px_rgba(0,0,0,0.25)]"
        >
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]",
                  isEmergencyRoute ? "text-emerald-500" : "text-blue-500",
                )}
              >
                {isEmergencyRoute ? "🛡️ Tactical Path" : "Nav Engine"}
              </span>
              <h3 className="text-[11px] md:text-[13px] font-black text-zinc-900 line-clamp-1 max-w-[150px] md:max-w-[180px]">
                {escapeDestination}
              </h3>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setEscapeRoute(null);
                setIsEmergencyRoute(false);
                setTarget(null);
              }}
              className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-zinc-100 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-1.5 md:gap-2 mb-2 md:mb-4">
            {[
              { mode: "driving", icon: Car },
              { mode: "walking", icon: Footprints },
              { mode: "cycling", icon: Bike },
            ].map((m) => (
              <button
                key={m.mode}
                onClick={() => {
                  setTravelMode(m.mode as TravelMode);
                  handleGetDirections(
                    isEmergencyRoute
                      ? findNearestSafetyPoint(currentCoords, infraData)
                      : target,
                    m.mode as TravelMode,
                    isEmergencyRoute,
                    escapeDestination,
                  );
                }}
                className={cn(
                  "flex-1 flex items-center justify-center h-10 md:h-12 rounded-[14px] md:rounded-[18px] border-2 transition-all",
                  travelMode === m.mode
                    ? "bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.02] md:scale-[1.05]"
                    : "bg-zinc-50 border-transparent text-zinc-400 hover:border-zinc-200",
                )}
              >
                <m.icon className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between bg-zinc-900 rounded-[20px] md:rounded-[24px] p-3 md:p-4 text-white">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 bg-white/10 rounded-lg md:rounded-xl flex items-center justify-center">
                <Radar className="h-4 w-4 md:h-5 md:w-5 text-red-500 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-base md:text-xl font-black leading-none">
                  {Math.ceil(escapeRoute.duration / 60)} min
                </span>
                <span className="text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em] text-zinc-500 mt-0.5 md:mt-1">
                  ETA
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm md:text-base font-bold block leading-none">
                {(escapeRoute.distance / 1000).toFixed(1)} km
              </span>
              <span className="text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em] text-zinc-500 mt-0.5 md:mt-1">
                DIST
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Safety Controls Overlay - Hidden during active navigation for focus */}
      {!escapeRoute && <SafetyActionBar />}

      {/* 🚨 SAFETY ALERT MODAL */}
      <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
        <DialogContent className="w-[92%] max-w-md bg-white/95 backdrop-blur-xl border-red-100 rounded-[32px] p-0 overflow-hidden shadow-2xl z-[10005]">
          <div className="bg-red-600 p-7 flex flex-col items-center text-center space-y-3">
            <DialogTitle className="sr-only">
              Safety Alert: High Risk Area Detected
            </DialogTitle>
            <DialogDescription className="sr-only">
              You have entered a high risk area. Please confirm if you want to
              notify your circle.
            </DialogDescription>
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <ShieldAlert className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                High Risk Area
              </h2>
              <p className="text-red-100 text-sm font-bold uppercase tracking-widest opacity-80">
                Threat Zone Detected
              </p>
            </div>
          </div>

          <div className="p-7 space-y-5">
            <div className="space-y-2">
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                You have entered{" "}
                <span className="text-zinc-900 font-bold">
                  "{detectedZone?.name}"
                </span>
                . Prohorini systems have flagged this area for high crime
                density.
              </p>
              <p className="text-zinc-900 font-bold text-base">
                Would you like to notify your selected circle members?
              </p>
            </div>

            <div className="flex flex-col gap-3 text-center">
              <Button
                onClick={handleSendAlert}
                disabled={isSendingAlert}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black h-12 rounded-2xl shadow-lg shadow-red-200"
              >
                {isSendingAlert ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "YES, ALERT MY CIRCLE"
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setAlertOpen(false);
                  setShowEscapeButton(true); // Show "Safe Path" button even if declined
                }}
                className="w-full text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:text-zinc-600 h-10"
              >
                No, I'm secure
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 📝 CRIME REPORT MODAL */}
      <CrimeReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};

export default LiveMap;
