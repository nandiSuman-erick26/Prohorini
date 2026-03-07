import { RootState } from "../rootRedux";

export const selectIsEditingProfile = (state: RootState) =>
  state.userProfile.isEditingProfile;
export const selectEditingContactId = (state: RootState) =>
  state.userProfile.editingContactId;
export const selectIsUploadingPhoto = (state: RootState) =>
  state.userProfile.isUploadingPhoto;
export const selectPhotoPreviewUrl = (state: RootState) =>
  state.userProfile.photoPreviewUrl;
export const selectDeletingContactId = (state: RootState) =>
  state.userProfile.deletingContactId;
