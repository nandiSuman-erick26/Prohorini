import type { FeatureCollection, LineString } from "geojson";

export interface RouteResult {
  geometry: FeatureCollection;
  distance: number; // in meters
  duration: number; // in seconds
}

export type TravelMode = "driving" | "walking" | "cycling";

/**
 * Fetches the fastest route from origin to destination using OSRM.
 *
 * @param origin - Starting coordinates { lat, lng }
 * @param destination - Ending coordinates { lat, lng }
 * @param profile - OSRM profile (car, walking, cycling)
 * @returns GeoJSON FeatureCollection with the route + distance/duration
 */
export const fetchRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  profile: TravelMode = "walking",
): Promise<RouteResult> => {
  // OSRM Public API profiles: 'driving', 'walking', 'cycling'
  const osrmProfile =
    profile === "cycling" ? "bicycle" : profile === "driving" ? "car" : "foot";

  const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=false`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`OSRM request failed: ${res.statusText}`);
  }

  const data = await res.json();

  if (!data.routes || data.routes.length === 0) {
    throw new Error("No route found by OSRM");
  }

  const route = data.routes[0];

  const geometry: FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: route.geometry as LineString,
      },
    ],
  };

  return {
    geometry,
    distance: route.distance, // meters
    duration: route.duration, // seconds
  };
};

/**
 * Compatibility wrapper for the existing escape route functionality.
 * Defaults to 'walking' (foot) as it's specifically for "emergency safe paths".
 */
export const fetchEscapeRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
): Promise<RouteResult> => {
  return fetchRoute(origin, destination, "walking");
};
