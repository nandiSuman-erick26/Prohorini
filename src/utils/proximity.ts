import * as turf from "@turf/turf";

export const findNearestSafetyPoint = (
  userCoords: { lat: number; lng: number },
  points: any[],
) => {
  if (!Array.isArray(points) || points.length === 0) return null;

  const userPoint = turf.point([userCoords.lng, userCoords.lat]);
  const pointFeatures = turf.featureCollection(
    points.map((p) => turf.point([p.lng, p.lat], { ...p })),
  );

  const nearest = turf.nearestPoint(userPoint, pointFeatures);
  const distance = turf.distance(userPoint, nearest, { units: "kilometers" });

  return {
    ...nearest.properties,
    distance: distance.toFixed(2),
  };
};

export const checkInsideZone = (
  userCoords: { lat: number; lng: number },
  zones: any[],
) => {
  const userPoint = turf.point([userCoords.lng, userCoords.lat]);

  if (!Array.isArray(zones)) return null;

  for (const zone of zones) {
    if (!zone.geojson) continue;

    // Turf handles polygons and multipolygons
    const isInside = turf.booleanPointInPolygon(userPoint, zone.geojson);

    if (isInside) {
      return zone;
    }
  }

  return null;
};
