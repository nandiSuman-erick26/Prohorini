export type AlertSeverity = "low" | "medium" | "high" | "critical" | "safe";

export interface AlertState {
  id: string;
  zoneId: string;
  zoneName: string;
  severity: AlertSeverity;
  message: string;
}
