import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import {
  ThreatZone,
  UserLocation,
  ZoneEvent,
  ZoneState,
} from "../typeScript/types/threats.types";

export const detectZoneEntry = (
  userLocation: UserLocation,
  threatZones: ThreatZone[],
  previousZonesState: ZoneState
): {
  events: ZoneEvent[];
  updatedState: ZoneState;
} => {
  const currentPoint = point([
    userLocation.lng,
    userLocation.lat,
  ]);

  const events: ZoneEvent[] = [];
  const updatedState: ZoneState = { ...previousZonesState };

  threatZones.forEach((zone) => {
    const isInside = booleanPointInPolygon(
      currentPoint,
      zone.geometry
    );

    const wasInside = previousZonesState[zone.id] ?? false;

    if (isInside && !wasInside) {
      events.push({ type: "ENTER", zoneId: zone.id });
      updatedState[zone.id] = true;
    }

    if (isInside && wasInside) {
      events.push({ type: "INSIDE", zoneId: zone.id });
    }

    if (!isInside && wasInside) {
      events.push({ type: "EXIT", zoneId: zone.id });
      updatedState[zone.id] = false;
    }
  });

  return { events, updatedState };
};
