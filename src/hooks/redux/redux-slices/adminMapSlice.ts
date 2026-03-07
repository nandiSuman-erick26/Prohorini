import { AdminMapInitialState } from "@/typeScript/interfaces/initialState.interface";
import {
  InfraModeType,
  InfraType,
  Maptype,
  SeverityType,
  TabType,
} from "@/typeScript/types/redux.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AdminMapInitialState = {
  drawGeo: null,
  mapType: "street",
  drawMode: false,
  severity: 0,
  selectedZoneId: null,
  zoneModalOpen: false,
  zoneDraftGeo: null,
  activeZoneFilter: "all",
  hiddenZoneIds: [],
  isZoneEditMode: false,
  editingZoneId: null,
  editingZoneDraft: null,
  //======== infra ============
  selectedInfraId: null,
  infraDraft: null,
  infraFilterType: "all",
  infraMode: "view",
};

const adminMapSlice = createSlice({
  name: "adminMap",
  initialState,
  reducers: {
    setDrawGeo: (state, action: PayloadAction<any>) => {
      state.drawGeo = action.payload;
    },

    setMapType: (state, action: PayloadAction<Maptype>) => {
      state.mapType = action.payload;
    },

    setDrawMode: (state, action: PayloadAction<boolean>) => {
      state.drawMode = action.payload;
    },

    setSeverity: (state, action: PayloadAction<number>) => {
      state.severity = action.payload;
    },

    setZoneSeverity: (state, action: PayloadAction<SeverityType>) => {
      state.activeZoneFilter = action.payload;
    },

    toggleZoneVisibility: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      if (state.hiddenZoneIds?.includes(id)) {
        state.hiddenZoneIds = state.hiddenZoneIds.filter(
          (zoneId) => zoneId !== id,
        );
      } else {
        state.hiddenZoneIds?.push(id);
      }
    },

    setSelectedZone: (state, action: PayloadAction<string | null>) => {
      state.selectedZoneId = action.payload;
    },

    setZoneDraft: (state, action: PayloadAction<any>) => {
      state.zoneDraftGeo = action.payload;
      state.zoneModalOpen = true;
    },

    closeZoneModal: (state) => {
      state.zoneModalOpen = false;
      // state.zoneDraftGeo = null;
    },

    clearDraw: (state) => {
      state.drawGeo = null;
    },

    startEditZone: (state, action: PayloadAction<string>) => {
      state.isZoneEditMode = true;
      state.editingZoneId = action.payload;
      state.editingZoneDraft = {
        geojson: null,
        // name: "",
        severity: null,
      };
    },

    stopEditZone: (state) => {
      state.isZoneEditMode = false;
      state.editingZoneId = null;
      state.editingZoneDraft = null;
    },

    setEditingZoneDraft: (state, action: PayloadAction<any>) => {
      state.editingZoneDraft = {
        ...state.editingZoneDraft,
        ...action.payload,
      };
    },
    //===================================================

    //===================================================
    //======================== infra ====================
    //===================================================
    
    //===================================================

    setInfraMode: (state, action: PayloadAction<InfraModeType>) => {
      state.infraMode = action.payload;
    },

    setInfraDraft: (state, action: PayloadAction<any>) => {
      // console.log("Redux updating infraDraftLocation");

      state.infraDraft = { ...state.infraDraft, ...action.payload };
      // state.infraModalOpen = true;
    },
    resetInfraDraft: (state) => {
      state.infraDraft = null;
    },
    setSelectedInfra: (state, action: PayloadAction<string | null>) => {
      state.selectedInfraId = action.payload;
    },
    setInfraFilterType: (state, action: PayloadAction<InfraType>) => {
      state.infraFilterType = action.payload;
    },

   
  },
});

export const {
  setDrawGeo,
  setMapType,
  setDrawMode,
  setSeverity,
  setZoneSeverity,
  toggleZoneVisibility,
  setSelectedZone,  
  setZoneDraft,
  closeZoneModal,
  clearDraw,
  startEditZone,  
  stopEditZone,
  setEditingZoneDraft,
  setInfraMode,
  setInfraDraft,
  resetInfraDraft,
  setSelectedInfra,
  setInfraFilterType
} = adminMapSlice.actions;
export default adminMapSlice.reducer;
