export const getSeverityColor = (severity: number | string) => {
  switch (severity) {
    case 1: // Safe / Importance
      return {
        color: "#22c55e",
        fillColor: "#4ade8099",
        weight: 2,
        fillOpacity: 0.4,
      };
    case 2:
      return {
        color: "#eab308",
        fillColor: "#facc1599",
        weight: 2,
        fillOpacity: 0.4,
      };
    case 3:
      return {
        color: "#f97316",
        fillColor: "#fb923c99",
        weight: 2,
        fillOpacity: 0.4,
      };
    case 4:
      return {
        color: "#ea580c",
        fillColor: "#f9731699",
        weight: 2,
        fillOpacity: 0.4,
      };
    case 5:
      return {
        color: "#dc2626",
        fillColor: "#ef444499",
        weight: 2,
        fillOpacity: 0.5,
      };
    default:
      return {
        color: "#6b7280",
        fillColor: "#9ca3af99",
        weight: 2,
        fillOpacity: 0.3,
      };
  }
};
