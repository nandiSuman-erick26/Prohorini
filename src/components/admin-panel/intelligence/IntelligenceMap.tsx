"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  GeoJSON,
  Marker,
  Popup,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { getSeverityColor } from "@/utils/severityColor";

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ─── Tile Maps ───
const TILE_MAPS = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};

// ─── Dynamic Tile Layer ───
const DynamicTileLayer = ({ mapType }: { mapType: keyof typeof TILE_MAPS }) => {
  const map = useMap();
  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) map.removeLayer(layer);
    });
    L.tileLayer(TILE_MAPS[mapType]).addTo(map);
  }, [mapType, map]);
  return null;
};

// ─── Heatmap Layer (from crime_data) ───
const HeatmapLayer = ({
  points,
  visible,
}: {
  points: any[];
  visible: boolean;
}) => {
  const map = useMap();
  const heatRef = useRef<any>(null);

  useEffect(() => {
    if (heatRef.current && map.hasLayer(heatRef.current)) {
      map.removeLayer(heatRef.current);
      heatRef.current = null;
    }

    if (!visible || !points?.length) return;
    if (typeof (L as any).heatLayer !== "function") return;

    const data = points.map((p: any) => [p.lat, p.lng, p.intensity || 0.5]);

    heatRef.current = (L as any).heatLayer(data, {
      radius: 30,
      blur: 20,
      minOpacity: 0.5,
      max: 1,
      gradient: {
        0.0: "#3b82f6",
        0.25: "#22d3ee",
        0.5: "#facc15",
        0.75: "#f97316",
        1.0: "#ef4444",
      },
    });
    heatRef.current.addTo(map);

    return () => {
      if (heatRef.current && map.hasLayer(heatRef.current)) {
        map.removeLayer(heatRef.current);
      }
      heatRef.current = null;
    };
  }, [points, visible, map]);

  return null;
};

// ─── Infrastructure Icon Factory ───
const createInfraIcon = (type: string) => {
  const config: Record<string, { color: string; emoji: string }> = {
    police: { color: "#3b82f6", emoji: "🚔" },
    hospital: { color: "#22c55e", emoji: "🏥" },
    help_center: { color: "#8b5cf6", emoji: "🆘" },
  };
  const { color, emoji } = config[type] ?? { color: "#6b7280", emoji: "📍" };
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${color};
      width:28px;
      height:28px;
      border-radius:50%;
      border:3px solid white;
      box-shadow:0 4px 14px rgba(0,0,0,.4);
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:14px;
    ">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// ─── Report Type Config ───
const REPORT_TYPE_CONFIG: Record<string, { color: string; label: string }> = {
  harassment: { color: "#f97316", label: "⚠️ Harassment" },
  theft: { color: "#eab308", label: "🥷 Theft" },
  stalking: { color: "#a855f7", label: "👁️ Stalking" },
  assault: { color: "#ef4444", label: "👊 Assault" },
  domestic_violence: { color: "#dc2626", label: "🏠 Domestic Violence" },
  kidnapping: { color: "#991b1b", label: "🚨 Kidnapping" },
  other: { color: "#6b7280", label: "❓ Other" },
};

// ─── Main Component ───
interface IntelligenceMapProps {
  heatPoints: any[];
  reportMarkers: any[];
  threatZones: any[];
  safetyInfra: any[];
  layers: {
    heatmap: boolean;
    zones: boolean;
    infra: boolean;
    reports: boolean;
  };
  mapType: keyof typeof TILE_MAPS;
}

const IntelligenceMap = ({
  heatPoints,
  reportMarkers,
  threatZones,
  safetyInfra,
  layers,
  mapType,
}: IntelligenceMapProps) => {
  return (
    <MapContainer
      center={[22.57, 88.36]}
      zoom={11}
      zoomControl={false}
      className="h-full w-full"
      style={{ background: "#1a1a2e" }}
    >
      <DynamicTileLayer mapType={mapType} />

      {/* ─── Heatmap Layer (Historical crime_data) ─── */}
      <HeatmapLayer points={heatPoints} visible={layers.heatmap} />

      {/* ─── User Crime Report Markers ─── */}
      {layers.reports &&
        reportMarkers?.map((report: any, idx: number) => {
          const typeConfig =
            REPORT_TYPE_CONFIG[report.type] || REPORT_TYPE_CONFIG.other;
          const statusColor =
            report.status === "approved"
              ? "#22c55e"
              : report.status === "pending"
                ? "#facc15"
                : "#ef4444";

          return (
            <CircleMarker
              key={report.id || idx}
              center={[report.lat, report.lng]}
              radius={7}
              pathOptions={{
                color: "white",
                weight: 2,
                fillColor: typeConfig.color,
                fillOpacity: 0.9,
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} sticky>
                <div
                  style={{
                    fontFamily: "system-ui",
                    minWidth: 200,
                    padding: "4px 0",
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      margin: 0,
                      color: typeConfig.color,
                    }}
                  >
                    {typeConfig.label}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      margin: "6px 0 4px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: statusColor,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#64748b",
                      }}
                    >
                      {report.status}
                    </span>
                  </div>
                  {report.description && (
                    <p
                      style={{
                        fontSize: 11,
                        color: "#475569",
                        margin: "6px 0 0",
                        lineHeight: 1.4,
                      }}
                    >
                      {report.description.length > 100
                        ? report.description.slice(0, 100) + "..."
                        : report.description}
                    </p>
                  )}
                  {report.date && (
                    <p
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#94a3b8",
                        marginTop: 6,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {new Date(report.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

      {/* ─── Threat Zone Polygons ─── */}
      {layers.zones &&
        threatZones?.map((zone: any) => (
          <GeoJSON
            key={zone.id}
            data={zone.geojson}
            style={() => ({
              ...getSeverityColor(zone.severity),
              weight: 3,
              dashArray: "6 4",
            })}
            onEachFeature={(feature, layer) => {
              layer.bindTooltip(
                `<div style="font-family:system-ui; padding:4px 0;">
                  <strong style="font-size:12px; text-transform:uppercase; letter-spacing:0.05em;">${zone.name}</strong><br/>
                  <span style="font-size:10px; opacity:0.7;">Severity: ${"🔴".repeat(zone.severity)}${"⚪".repeat(5 - zone.severity)}</span>
                </div>`,
                { sticky: true, direction: "top" },
              );
              layer.on({
                mouseover: (e: any) => {
                  e.target.setStyle({ weight: 5, fillOpacity: 0.7 });
                },
                mouseout: (e: any) => {
                  e.target.setStyle({
                    ...getSeverityColor(zone.severity),
                    weight: 3,
                    dashArray: "6 4",
                  });
                },
              });
            }}
          />
        ))}

      {/* ─── Infrastructure POIs ─── */}
      {layers.infra &&
        safetyInfra?.map((infra: any) => (
          <Marker
            key={infra.id}
            position={[infra.lat, infra.lng]}
            icon={createInfraIcon(infra.type)}
          >
            <Popup>
              <div
                style={{
                  fontFamily: "system-ui",
                  minWidth: 180,
                  padding: "4px 0",
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    margin: 0,
                  }}
                >
                  {infra.name}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#64748b",
                    margin: "4px 0 0",
                  }}
                >
                  {infra.type.replace("_", " ")}
                </p>
                {infra.address && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "#94a3b8",
                      margin: "6px 0 0",
                    }}
                  >
                    {infra.address}
                  </p>
                )}
                {infra.phone && (
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#3b82f6",
                      margin: "4px 0 0",
                    }}
                  >
                    📞 {infra.phone}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default IntelligenceMap;
