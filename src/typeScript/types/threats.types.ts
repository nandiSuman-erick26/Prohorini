import { Feature, Polygon, MultiPolygon, LineString } from "geojson";

export type ZoneType = "threat_zone" | "safe_zone" | "exit_route";

export interface ThreatZone {
  id: string;
  name: string;
  type: ZoneType;
  severity: "low" | "medium" | "high" | "critical" | "safe";
  geometry: Feature<Polygon | MultiPolygon | LineString>;
  color?: string;
}
export interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
}

export type LocationStatus =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "error";

export type ZoneState = Record<string, boolean>;

export type ZoneEventType = "ENTER" | "INSIDE" | "EXIT";

export interface ZoneEvent {
  type: ZoneEventType;
  zoneId: string;
}

export interface ZoneEventLog {
  zoneId: string;
  zoneName: string;
  severity: string;
  type: ZoneEventType;
  timestamp: string;
}
