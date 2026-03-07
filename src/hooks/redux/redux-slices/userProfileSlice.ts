import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfileState {
  userProfile: {
    id: string | null;
    full_name: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    role: string;
    email: string;
    photo_url: string;
    is_profile_completed: boolean;
  } | null;
  emergencyContacts: any[] | null;
  isEditingProfile: boolean;
  editingContactId: string | null;
  isUploadingPhoto: boolean;
  photoPreviewUrl: string | null;
  deletingContactId: string | null;
}

const initialState: UserProfileState = {
  userProfile: null,
  isEditingProfile: false,
  editingContactId: null,
  isUploadingPhoto: false,
  photoPreviewUrl: null,
  deletingContactId: null,
  emergencyContacts: null,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setIsEditingProfile: (state, action: PayloadAction<boolean>) => {
      state.isEditingProfile = action.payload;
    },
    setEditingContactId: (state, action: PayloadAction<string | null>) => {
      state.editingContactId = action.payload;
    },
    setIsUploadingPhoto: (state, action: PayloadAction<boolean>) => {
      state.isUploadingPhoto = action.payload;
    },
    setPhotoPreviewUrl: (state, action: PayloadAction<string | null>) => {
      state.photoPreviewUrl = action.payload;
    },
    setDeletingContactId: (state, action: PayloadAction<string | null>) => {
      state.deletingContactId = action.payload;
    },
    resetProfileState: (state) => {
      state.isEditingProfile = false;
      state.editingContactId = null;
      state.isUploadingPhoto = false;
      state.photoPreviewUrl = null;
      state.deletingContactId = null;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setEmergencyContacts: (state, action: PayloadAction<any[] | null>) => {
      state.emergencyContacts = action.payload;
    },
    clearUserProfile: (state) => {
      return initialState;
    },
  },
});

export const {
  setIsEditingProfile,
  setEditingContactId,
  setIsUploadingPhoto,
  setPhotoPreviewUrl,
  setDeletingContactId,
  resetProfileState,
  setUserProfile,
  setEmergencyContacts,
  clearUserProfile,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
