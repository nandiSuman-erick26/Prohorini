"use client";

import { useMapEvents } from "react-leaflet";

interface MapClickHandlerProps {
  onClick: (latlng: { lat: number; lng: number }) => void;
}

const MapClickHandler = ({ onClick }: MapClickHandlerProps) => {
  useMapEvents({
    click: (e) => {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return null;
};

export default MapClickHandler;
