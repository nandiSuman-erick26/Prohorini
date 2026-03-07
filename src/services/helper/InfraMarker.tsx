import { setSelectedInfra } from "@/hooks/redux/redux-slices/adminMapSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import { getInfraIcon } from "@/utils/getInfraIcon";
import { useEffect } from "react";
import { Marker, useMap } from "react-leaflet";

export const InfraMarker = ({ infra }: any) => {
  const dispatch = useAppDispatch();
  const { selectedInfraId } = useAppSelector((state) => state.adminMap);
  const map = useMap();

  const isSelected = selectedInfraId === infra.id;

  useEffect(() => {
    if (isSelected) {
      map.flyTo([infra.lat, infra.lng], 15);
    }
  }, [isSelected]);

  return (
    <Marker
      position={[infra.lat, infra.lng]}
      icon={getInfraIcon(infra.type)}
      eventHandlers={{ click: () => dispatch(setSelectedInfra(infra.id)) }}
    />
  );
};
