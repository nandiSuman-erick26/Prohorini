import {
  InfraModeType,
  InfraType,
  Maptype,
  SeverityType,
  TabType,
} from "../types/redux.type";




export interface AdminMapInitialState {
  //======================================================================================
  // zones
  //======================================================================================
  drawGeo: any | null;
  mapType: Maptype;
  drawMode: boolean;
  severity: number;
  selectedZoneId?: string | null;
  activeZoneFilter?: SeverityType;
  hiddenZoneIds?: string[];
  zoneModalOpen: boolean;
  zoneDraftGeo: any | null;
  isZoneEditMode?: boolean;
  editingZoneId?: string | null;
  editingZoneDraft?: {
    geojson: any | null;
    // name: string;
    severity: number | null;
  } | null;

  //======================================================================================
  // infra
  //======================================================================================
  selectedInfraId: string | null;
  infraDraft: { lat: number; lng: number; name: string; type: string } | null;
  infraFilterType: InfraType;
  infraMode: InfraModeType;
  activeInfraTab?: TabType;
}