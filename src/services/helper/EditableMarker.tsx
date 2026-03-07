import { setInfraDraft } from "@/hooks/redux/redux-slices/adminMapSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import { getInfraIcon } from "@/utils/getInfraIcon";
import { Marker } from "react-leaflet";

export function EditableMarker({infra}:any){
  const dispatch = useAppDispatch();
  const {infraDraft} = useAppSelector((state) => state.adminMap);

  const lat = infraDraft?.lat ?? infra.lat;
  const lng = infraDraft?.lng ?? infra.lng;

  return (
    <Marker
    position={[lat, lng]}
    icon={getInfraIcon(infra.type)}
    draggable
    eventHandlers={{
      dragend: (e:any)=> {
        const {lat, lng} = e.target.getLatLng()
        dispatch(setInfraDraft({lat, lng}))
      }
    }}
    />
  )
}