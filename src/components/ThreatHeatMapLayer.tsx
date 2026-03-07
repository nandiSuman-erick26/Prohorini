"use client";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

const ThreatHeatMapLayer = ({ data }: any) => {
  const map = useMap();
  const heatRef = useRef<any>(null);

  useEffect(() => {
    // Guard clauses
    if (!map || !data || !Array.isArray(data) || data.length === 0) {
      return;
    }

    // Remove existing heat layer if any
    if (heatRef.current && map.hasLayer(heatRef.current)) {
      map.removeLayer(heatRef.current);
      heatRef.current = null;
    }

    try {
      // Check if heatLayer is available
      if (typeof (L as any).heatLayer !== "function") {
        console.warn("leaflet.heat plugin not loaded");
        return;
      }

      // Create heat layer
      const heatLayer = (L as any).heatLayer(data, {
        radius: 35,
        blur: 20,
        minZoom: 10,
        maxZoom: 20,
        minOpacity: 0.7,
        max: 1,
        gradient: {
          0.0: "#0000ff",      // Blue
          0.25: "#00ffff",     // Cyan
          0.5: "#00ff00",      // Lime
          0.75: "#ffff00",     // Yellow
          1.0: "#ff0000",      // Red
        },
      });

      // Store reference and add to map
      heatRef.current = heatLayer;
      heatLayer.addTo(map);
    } catch (error) {
      console.error("Error creating heat layer:", error);
      heatRef.current = null;
    }

    // Cleanup function
    return () => {
      try {
        if (heatRef.current && map && map.hasLayer(heatRef.current)) {
          map.removeLayer(heatRef.current);
        }
        heatRef.current = null;
      } catch (error) {
        console.error("Error removing heat layer:", error);
      }
    };
  }, [data, map]);

  return null;
};

export default ThreatHeatMapLayer;
