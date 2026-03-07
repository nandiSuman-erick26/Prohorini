"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useMap, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import Supercluster from "supercluster";
import { makeMarker } from "@/utils/markerFactory";

interface CrimeClusterLayerProps {
  data: any[]; // Expecting raw crime data with lat, lng, severity
}

const CrimeClusterLayer = ({ data }: CrimeClusterLayerProps) => {
  const map = useMap();
  const [clusters, setClusters] = useState<any[]>([]);

  // Initialize Supercluster
  const index = useMemo(() => {
    const sc = new Supercluster({
      radius: 60,
      maxZoom: 16,
      map: (p) => ({ sumSeverity: p.severity || 1 }),
      reduce: (acc, p) => {
        acc.sumSeverity += p.sumSeverity;
      },
    });

    const points = data.map((p) => ({
      type: "Feature",
      properties: {
        cluster: false,
        crimeId: `${p.lat}-${p.lng}-${Math.random()}`,
        severity: Number(p.severity || 1),
      },
      geometry: {
        type: "Point",
        coordinates: [p.lng, p.lat],
      },
    }));

    sc.load(points as any);
    return sc;
  }, [data]);

  // Update clusters on map move/zoom
  const updateClusters = () => {
    const bounds = map.getBounds();
    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];
    const zoom = Math.floor(map.getZoom());
    setClusters(index.getClusters(bbox, zoom));
  };

  useEffect(() => {
    updateClusters();
    map.on("moveend", updateClusters);
    map.on("zoomend", updateClusters);
    return () => {
      map.off("moveend", updateClusters);
      map.off("zoomend", updateClusters);
    };
  }, [index, map]);

  // Cluster Icon Creator
  const createClusterIcon = (count: number, severitySum: number) => {
    const avgSeverity = severitySum / count;
    let bgColor = "bg-green-500";
    if (avgSeverity > 4) bgColor = "bg-red-600";
    else if (avgSeverity > 3) bgColor = "bg-orange-500";
    else if (avgSeverity > 2) bgColor = "bg-yellow-500";

    return L.divIcon({
      html: `<div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white text-white font-bold text-xs shadow-lg ${bgColor}">${count}</div>`,
      className: "custom-cluster-icon",
      iconSize: L.point(32, 32),
    });
  };

  return (
    <>
      {clusters.map((c, idx) => {
        const [lng, lat] = c.geometry.coordinates;
        const { cluster, point_count, sumSeverity, severity } = c.properties;

        if (cluster) {
          return (
            <Marker
              key={`cluster-${c.id || idx}`}
              position={[lat, lng]}
              icon={createClusterIcon(point_count, sumSeverity)}
              eventHandlers={{
                click: () => {
                  const expansionZoom = Math.min(
                    index.getClusterExpansionZoom(c.id),
                    18,
                  );
                  map.setView([lat, lng], expansionZoom);
                },
              }}
            />
          );
        }

        // Individual Points (when zoomed in)
        return (
          <Marker
            key={`crime-${c.properties.crimeId}`}
            position={[lat, lng]}
            icon={makeMarker("search-pin")} // Or a specific crime icon
          >
            <Tooltip>
              <div className="text-xs font-semibold">
                Crime Intensity: {severity}
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
};

export default CrimeClusterLayer;
