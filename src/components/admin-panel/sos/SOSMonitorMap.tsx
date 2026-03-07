"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { makeMarker } from "@/utils/markerFactory";

// Marker fix for Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface SOSMonitorMapProps {
  activeSos: any[];
  selectedUser: any | null;
  onMarkerClick: (sos: any) => void;
}

const ZoomToUser = ({ selectedUser }: { selectedUser: any }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedUser) {
      map.flyTo([selectedUser.latitude, selectedUser.longitude], 16, {
        duration: 1.5,
      });
    }
  }, [selectedUser, map]);
  return null;
};

const SOSMonitorMap = ({
  activeSos,
  selectedUser,
  onMarkerClick,
}: SOSMonitorMapProps) => {
  return (
    <MapContainer
      center={[22.5726459, 88.3638953]} // Default to kolkata center
      zoom={13}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ZoomToUser selectedUser={selectedUser} />

      {activeSos.map((sos) => (
        <Marker
          key={sos.user_id}
          position={[sos.latitude, sos.longitude]}
          icon={makeMarker("user-alert")}
          eventHandlers={{
            click: () => onMarkerClick(sos),
          }}
        >
          <Popup className="rounded-2xl">
            <div className="p-1">
              <h4 className="font-black text-slate-900 text-sm mb-1 uppercase">
                {sos.users_profile?.full_name}
              </h4>
              <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-500 uppercase">
                <span>SOS TRIGGERED</span>
                <span className="text-red-600">
                  LATEST UPDATED AT{" "}
                  {new Date(sos.updated_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default SOSMonitorMap;
