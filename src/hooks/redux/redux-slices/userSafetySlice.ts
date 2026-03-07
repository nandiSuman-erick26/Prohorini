import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ================================
   TYPES
================================ */

export type SafetyStatus = "safe" | "risk" | "sos";

export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  updatedAt: string;
}

export interface SharingSession {
  active: boolean;
  startedAt: string | null;
  expiresAt: string | null;
}

export interface CircleLiveLocation {
  userId: string;
  coords: Coordinates;
  isSharing: boolean;
  isSosActive: boolean;
}

/* ================================
   STATE
================================ */

interface UserSafetyState {
  // Self state
  sharingSession: SharingSession;
  currentCoords: Coordinates | null;
  safetyStatus: SafetyStatus;
  autoShareOnThreat: boolean;
  smartGeofencingEnabled: boolean;

  // Circle members live tracking
  circleLiveLocations: Record<string, CircleLiveLocation>;

  // History for logging/trails
  locationHistory: Coordinates[];
}

const initialState: UserSafetyState = {
  sharingSession: {
    active: false,
    startedAt: null,
    expiresAt: null,
  },

  currentCoords: null,
  safetyStatus: "safe",
  autoShareOnThreat: false,
  smartGeofencingEnabled: true,

  circleLiveLocations: {},
  locationHistory: [],
};

/* ================================
   SLICE
================================ */

const userSafetySlice = createSlice({
  name: "userSafety",
  initialState,
  reducers: {
    /* =====================================
       SHARING CONTROL
    ===================================== */

    startSharingSession(
      state,
      action: PayloadAction<{ startedAt: string; expiresAt: string | null }>,
    ) {
      state.sharingSession.active = true;
      state.sharingSession.startedAt = action.payload.startedAt;
      state.sharingSession.expiresAt = action.payload.expiresAt;
    },

    stopSharingSession(state) {
      state.sharingSession.active = false;
      state.sharingSession.startedAt = null;
      state.sharingSession.expiresAt = null;
    },

    /* =====================================
       SELF LOCATION UPDATE
    ===================================== */

    updateSelfCoords(state, action: PayloadAction<Coordinates>) {
      state.currentCoords = action.payload;
      // Maintain history for logging/trails (max 50 points)
      state.locationHistory.push(action.payload);
      if (state.locationHistory.length > 50) {
        state.locationHistory.shift();
      }
    },

    /* =====================================
       SAFETY STATUS CONTROL
    ===================================== */

    setSafetyStatus(state, action: PayloadAction<SafetyStatus>) {
      state.safetyStatus = action.payload;
    },

    triggerSos(state) {
      state.safetyStatus = "sos";
    },

    clearSos(state) {
      if (state.safetyStatus === "sos") {
        state.safetyStatus = "safe";
      }
    },

    /* =====================================
       AUTO SHARE SETTING
    ===================================== */

    setAutoShareOnThreat(state, action: PayloadAction<boolean>) {
      state.autoShareOnThreat = action.payload;
    },

    toggleSmartGeofencing(state) {
      state.smartGeofencingEnabled = !state.smartGeofencingEnabled;
    },

    /* =====================================
       CIRCLE LIVE LOCATION HANDLING
    ===================================== */

    updateCircleMemberLocation(
      state,
      action: PayloadAction<{
        userId: string;
        coords: Coordinates;
        isSharing: boolean;
        isSosActive: boolean;
      }>,
    ) {
      const { userId, coords, isSharing, isSosActive } = action.payload;

      state.circleLiveLocations[userId] = {
        userId,
        coords,
        isSharing,
        isSosActive,
      };
    },

    removeCircleMemberLocation(state, action: PayloadAction<string>) {
      delete state.circleLiveLocations[action.payload];
    },

    clearAllCircleLocations(state) {
      state.circleLiveLocations = {};
    },
  },
});

/* ================================
   EXPORTS
================================ */

export const {
  startSharingSession,
  stopSharingSession,
  updateSelfCoords,
  setSafetyStatus,
  triggerSos,
  clearSos,
  setAutoShareOnThreat,
  toggleSmartGeofencing,
  updateCircleMemberLocation,
  removeCircleMemberLocation,
  clearAllCircleLocations,
} = userSafetySlice.actions;

export default userSafetySlice.reducer;
