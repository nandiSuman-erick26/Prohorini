import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminProfile {
  adminProfile: {
    id: string | null;
    full_name: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    role: string;
    email: string;
    photo_url: string;
  } | null;
}

const initialState: AdminProfile = {
  adminProfile: null,
};

const adminSlice = createSlice({
  name: "admin-profile",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.adminProfile = action.payload;
    },
    clearProfile: (state) => {
      state.adminProfile = null;
    },
  },
});

export const { setProfile, clearProfile } = adminSlice.actions;
export default adminSlice.reducer;
