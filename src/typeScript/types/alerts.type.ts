export type AlertSeverity = "low" | "medium" | "high" | "critical";

export interface AlertState {
  id: string;
  zoneId: string;
  zoneName: string;
  severity: AlertSeverity;
  message: string;
}