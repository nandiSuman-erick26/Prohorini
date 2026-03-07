import * as turf from "@turf/turf";
import { FeatureCollection, Point } from "geojson";
import { CrimePoint, DensityPoint } from "@/typeScript/types/heatMap.types";

export const generateDensityGrid = (
  points: CrimePoint[],
  bbox: [number, number, number, number],
  cellSize: number = 0.5,
): DensityPoint[] => {
  if (!points.length) return [];

  const pointFeatures: FeatureCollection<Point> = turf.featureCollection(
    points.map((p) =>
      turf.point([p.lng, p.lat], {
        severity: p.severity ?? 1,
      }),
    ),
  );

  const grid = turf.squareGrid(bbox, cellSize, {
    units: "kilometers",
  });

  const counted = turf.collect(grid, pointFeatures, "severity", "values");
  if (grid.features.length === 0) return [];

  return counted.features.map((cell) => {
    const values = (cell.properties?.values as number[]) || [];

    const weight = values.reduce((sum, val) => sum + val, 0);

    const center = turf.center(cell).geometry.coordinates;

    return {
      lat: center[1],
      lng: center[0],
      weight,
    };
  });
};
