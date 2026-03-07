import { createSlice } from "@reduxjs/toolkit";

interface Super_AdminProfile {
   super_adminProfile: {
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

const initialState : Super_AdminProfile = {
  super_adminProfile : null
}

const adminSlice = createSlice({
  name:"super-admin-profile",
  initialState,
  reducers:{
    setProfile:(state,action)=>{
      state.super_adminProfile = action.payload
    },
    clearProfile: (state)=>{
      state.super_adminProfile = null
    }
  }
})