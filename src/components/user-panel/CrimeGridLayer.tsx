"use client";

import React, { useMemo } from "react";
import { Rectangle, Tooltip } from "react-leaflet";
import * as turf from "@turf/turf";
import { generateDensityGrid } from "@/utils/heatMapDensity";
import { CrimePoint } from "@/typeScript/types/heatMap.types";

interface CrimeGridLayerProps {
  data: any[];
  bbox: [number, number, number, number] | null;
}

export const CrimeGridLayer = ({ data, bbox }: CrimeGridLayerProps) => {
  const gridCells = useMemo(() => {
    if (!bbox || !data.length) return [];

    // Transform raw data to CrimePoint
    const points: CrimePoint[] = data.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      severity: Number(p.severity || 1),
      type: p.category || "other",
      date: p.date || new Date().toISOString(),
    }));

    // Generate grid using utility. Cell size in KM.
    const cellSize = 0.5; // 500m grid
    const densityPoints = generateDensityGrid(points, bbox, cellSize);

    return densityPoints.filter((p) => p.weight > 0);
  }, [data, bbox]);

  const getColor = (weight: number) => {
    if (weight > 20) return "#990000"; // Critical
    if (weight > 10) return "#ff4444"; // High
    if (weight > 5) return "#ffbb33"; // Medium
    return "#00c851"; // Low
  };

  return (
    <>
      {gridCells.map((cell, idx) => {
        // Calculate cell bounds for Rectangle (cellSize is 0.5km)
        // This is a rough estimation of the square around the center point
        const offset = 0.00225; // approx 250m in degrees for 0.5km cell
        const bounds: [[number, number], [number, number]] = [
          [cell.lat - offset, cell.lng - offset],
          [cell.lat + offset, cell.lng + offset],
        ];

        return (
          <Rectangle
            key={`grid-${idx}`}
            bounds={bounds}
            pathOptions={{
              fillColor: getColor(cell.weight),
              fillOpacity: 0.35,
              weight: 1,
              color: "white",
              opacity: 0.2,
            }}
          >
            <Tooltip permanent={false}>
              <div className="text-xs">
                <strong>Safety Risk Index:</strong> {cell.weight}
              </div>
            </Tooltip>
          </Rectangle>
        );
      })}
    </>
  );
};
