import { AlertSeverity } from "@/typeScript/types/alerts.type";
import { ThreatZone } from "@/typeScript/types/threats.types";

const severityPriority: Record<AlertSeverity, number> = {
  safe: 0,
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export const getHighestSeverityZone = (
  activeZoneIds: string[],
  threatZones: ThreatZone[],
): ThreatZone | null => {
  const activeZones = threatZones.filter((zone) =>
    activeZoneIds.includes(zone.id),
  );

  if (activeZones.length === 0) return null;

  return activeZones.reduce((highest, current) => {
    if (
      severityPriority[current.severity] > severityPriority[highest.severity]
    ) {
      return current;
    }
    return highest;
  });
};
