"use client"
import {
  //  useAppDispatch, 
   useAppSelector } from '@/hooks/redux/store/rootRedux'
import { getSafetyInfra } from '@/services/api/safetyInfra.api'
import { useQuery } from '@tanstack/react-query'
import {MapContainer, TileLayer, Marker, useMap, 
  // useMap, useMapEvent
} from "react-leaflet"
// import L from "leaflet"
// import MapClickHandler from '@/services/helper/MapClickHandler'
// import { InfraMarker } from '@/services/helper/InfraMarker'
// import { getInfraIcon } from '../ThreatZoneMapDraw'
import { EditableMarker } from '@/services/helper/EditableMarker'
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect } from 'react'
import { InfraMarker } from '@/services/helper/InfraMarker'


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
    const tileUrl = TILE_MAPS[mapType];
    if (!tileUrl || !map) return;

    const tileLayer = L.tileLayer(tileUrl);
    tileLayer.addTo(map);

    return () => {
      if (map.hasLayer(tileLayer)) {
        map.removeLayer(tileLayer);
      }
    };
  }, [mapType, map]);

  return null;
};

export const createInfraIcon = (type: string) => {
  const colors: Record<string, string> = {
    police: "blue",
    hospital: "green",
    help_center: "purple",
    draft: "#000000",
  };
  const background = colors[type] ?? " #000000";
  return L.divIcon({
    className: "",
    html: `<div style="
  background:${background};
  width:16px;
  height:16px;
  border-radius:50%;
  border: 2px solid #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,.4);
  "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};
// const CENTER = [22.57, 88.36]

const InfrastructureMap = () => {
  // const dispatch = useAppDispatch()
  const {infraMode, selectedInfraId, infraDraft, infraFilterType, mapType} = useAppSelector((state) => state.adminMap);
  const {data: infra} = useQuery({queryKey: ["infra"], queryFn: getSafetyInfra});
  const filteredInfra = infra?.filter((i: any) => infraFilterType === "all" ? true : i.type === infraFilterType) ?? [];

  console.log("infra Mode", infraMode);
  console.log("infra draft", infraDraft);
  return (
    <MapContainer
    center={[22.57, 88.36]}
    zoom={10}
    zoomControl={false}
    className='h-full w-full rounded-xl'
    >
      
      <DynamicTileLayer mapType={mapType}/>

      {/* {view mode} */}

      {infraMode === "view" && filteredInfra?.map((i:any)=>(
        <InfraMarker key={i.id} infra={i}/>
      ))}

      {/* {ADD MORE} */}

      {infraMode === "add" && infraDraft && (
        <Marker position={[infraDraft.lat, infraDraft.lng]} icon={createInfraIcon("draft")}/>
      )}

      {/* {Edit More} */}

      {infraMode === "edit" && filteredInfra?.filter((i:any) => i.id === selectedInfraId)?.map((i:any)=>(
        <EditableMarker key={i.id} infra={i}/>
      ))}
    
    </MapContainer>
  )
}

export default InfrastructureMap