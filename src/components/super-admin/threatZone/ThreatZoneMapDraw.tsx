"use client";

import {
  setEditingZoneDraft,
  // setInfraDraftLocation,
  setZoneDraft,
  stopEditZone,
} from "@/hooks/redux/redux-slices/adminMapSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import { getSeverityColor } from "@/utils/severityColor";
import { useEffect, useRef } from "react";
import {
  MapContainer,
  FeatureGroup,
  GeoJSON,
  Marker,
  useMap,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateZone } from "@/services/api/zone.api";
// import { toast } from "sonner";
import "leaflet-draw/dist/leaflet.draw.css";
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export const getInfraIcon = (type: string) => {
  const colors: any = {
    police: "blue",
    hospital: "green",
    help_center: "purple",
  };
  return L.divIcon({
    className: "",
    html: `<div style="
  background:${colors[type]};
  width:16px;
  height:16px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#fff;
  font-size:16px;
  font-weight:600;
  "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const TILE_MAPS = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  topo: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
};

const DynamicTileLayer = ({ mapType }: { mapType: keyof typeof TILE_MAPS }) => {
  const map = useMap();

  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    const tileLayer = L.tileLayer(TILE_MAPS[mapType]);
    tileLayer.addTo(map);
    return () => {
      if (map.hasLayer(tileLayer)) {
        map.removeLayer(tileLayer);
      }
    };
  }, [mapType, map]);

  return null;
};

const ThreatZoneMapDraw = ({
  zones,
  infra,
  enableInfraAdd,
}: {
  zones?: any;
  infra?: any;
  enableInfraAdd?: boolean;
}) => {
  const editFeatureGroupRef = useRef<L.FeatureGroup>(null);
  const query = useQueryClient();
  const dispatch = useAppDispatch();
  const {
    mapType,
    drawMode,
    hiddenZoneIds,
    activeZoneFilter,
    isZoneEditMode,
    editingZoneId,
  } = useAppSelector((state) => state.adminMap);

  // console.log("Edit mode active", isZoneEditMode);
  // console.log("Editing Zone", editingZoneId);

  const updateZoneMutation = useMutation({
    mutationFn: updateZone,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["zones"] });
      dispatch(stopEditZone());
      // toast.success("Zone updated successfully");
    },
  });

  const visibilityZones = zones
    ?.filter((z: any) =>
      activeZoneFilter === "all"
        ? true
        : Number(z.severity) === Number(activeZoneFilter),
    )
    ?.filter((z: any) => !hiddenZoneIds?.includes(z.id));

  // Cleanup map instance on unmount
  useEffect(() => {
    if (!isZoneEditMode || !editingZoneId || !editFeatureGroupRef.current)
      return;

    editFeatureGroupRef.current.clearLayers();

    const zone = zones?.find((z: any) => z.id === editingZoneId);
    if (!zone) return;

    const layer = L.geoJSON(zone.geojson);

    layer.eachLayer((l: any) => {
      editFeatureGroupRef.current?.addLayer(l);
    });
    return () => {
      // This cleanup will run when the component unmounts
      // React-Leaflet handles most cleanup, but this ensures proper disposal
    };
  }, [isZoneEditMode, editingZoneId, zones]);

  // console.log("ENABLE-ADD-INFRA", enableInfraAdd);

  return (
    <MapContainer
      center={[22.57, 88.36]}
      zoom={10}
      className="h-full w-full rounded-none"
      zoomControl={false}
    >
      <DynamicTileLayer mapType={mapType} />

      {/* <MapClickHandler
        enableInfraAdd={enableInfraAdd}
        onClick={(latlng: any) => {
          console.log("map clicked", latlng);

          dispatch(
            setInfraDraftLocation({
              lat: latlng.lat,
              lng: latlng.lng,
            }),
          );
        }}
      /> */}
      {drawMode && (
        <FeatureGroup>
          <EditControl
            position="topright"
            draw={{
              rectangle: true,
              polygon: true,
              circle: false,
              marker: false,
              polyline: true,
            }}
            onCreated={(e: any) => {
              dispatch(setZoneDraft(e.layer.toGeoJSON()));
            }}
          />
        </FeatureGroup>
      )}

      {isZoneEditMode && !drawMode ? (
        <FeatureGroup ref={editFeatureGroupRef}>
          <EditControl
            position="topright"
            draw={{
              rectangle: false,
              polygon: false,
              circle: false,
              marker: false,
              polyline: false,
            }}
            edit={{
              edit: true,
              remove: false,
            }}
            onEdited={(e: any) => {
              e.layers.eachLayer((layer: any) => {
                const updatedGeo = layer.toGeoJSON();
                dispatch(
                  setEditingZoneDraft({
                    geojson: updatedGeo,
                    // name: editingZoneDraft?.name
                  }),
                );
              });
              // const layers = e.layers;
              // layers.eachLayer((layer: any) => {
              //   const updatedGeo = layer.toGeoJSON();

              //   updateZoneMutation.mutate({
              //     id: editingZoneId,
              //     geojson: updatedGeo,
              //   });
              // });
            }}
          />
        </FeatureGroup>
      ) : (
        !drawMode &&
        visibilityZones?.map((z: any) => (
          <GeoJSON
            key={z.id}
            data={z.geojson}
            style={() => getSeverityColor(z.severity)}
            onEachFeature={(feature, layer) => {
              layer.bindTooltip(
                `<strong className="text-sm text-blue-500">${z.name}</strong><br /> Severity: ${z.severity}`,
                { sticky: true },
              );
              layer.on({
                mouseover: (e: any) => {
                  e.target.setStyle({
                    weight: 4,
                    fillOpacity: 0.6,
                  });
                },
                mouseout: (e: any) => {
                  e.target.setStyle(getSeverityColor(z.severity));
                },
              });
            }}
          />
        ))
      )}

      {/* <FeatureGroup ref={editFeatureGroupRef}>
        {isZoneEditMode && (
          <EditControl
            position="topright"
            draw={{
              rectangle: false,
              polygon: false,
              circle: false,
              marker: false,
              polyline: false,
            }}
            edit={{
              edit: true,
              remove: false,
            }}
            onEdited={(e) => {
              const layers = e.layers;
              layers.eachLayer((layer: any) => {
                const updatedGeo = layer.toGeoJSON();

                updateZoneMutation.mutate({
                  id: editingZoneId,
                  geojson: updatedGeo,
                });
              });
            }}
          />
        )}
      </FeatureGroup> */}

      {/* {visibilityZones?.map((z: any) => {
        if (z.id === editingZoneId) {
          return (
            <GeoJSON
              key={z.id}
              data={z.geojson}
              style={() => getSeverityColor(z.severity)}
              onEachFeature={(feature, layer) => {
                const typeLabel = z.type?.replace("_", " ").toUpperCase() || "ZONE";
                layer.bindTooltip(
                  `<div class="p-1">
                    <strong class="text-blue-600">${z.name}</strong><br />
                    <span class="text-[10px] font-bold opacity-70">${typeLabel}</span><br />
                    <span class="text-[10px]">Severity/Rank: ${z.severity}</span>
                  </div>`,
                  { sticky: true, direction: "top" },
                );
                layer.on({
                  mouseover: (e: any) => {
                    e.target.setStyle({
                      weight: 4,
                      fillOpacity: 0.8,
                    });
                  },
                  mouseout: (e: any) => {
                    e.target.setStyle(getSeverityColor(z.severity));
                  },
                });
              }}
            />
          );
        }
        return (
          <GeoJSON
            key={z.id}
            data={z.geojson}
            style={() => getSeverityColor(z.severity)}
            onEachFeature={(feature, layer) => {
              layer.bindTooltip(
                `<strong className="text-sm text-blue-500">${z.name}</strong><br /> Severity: ${z.severity}`,
                { sticky: true },
              );
              layer.on({
                mouseover: (e: any) => {
                  e.target.setStyle({
                    weight: 4,
                    fillOpacity: 0.6,
                  });
                },
                mouseout: (e: any) => {
                  e.target.setStyle(getSeverityColor(z.severity));
                },
              });
            }}
          />
        );
      })} */}

      {infra?.map((i: any) => (
        <Marker
          key={i.id}
          position={[i.lat, i.lng]}
          icon={getInfraIcon(i.type)}
        />
      ))}

      {/* {enableInfraAdd && infraDraftLocation && (
        <Marker position={[infraDraftLocation.lat, infraDraftLocation.lng]} />
      )} */}
    </MapContainer>
  );
};

export default ThreatZoneMapDraw;
