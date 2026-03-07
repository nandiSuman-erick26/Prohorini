import { configureStore } from "@reduxjs/toolkit";
import userSaftyReducer from "@/hooks/redux/redux-slices/userSafetySlice";
import userSessionReducer from "@/hooks/redux/redux-slices/userSessionSlice";
import userProfileReducer from "@/hooks/redux/redux-slices/userProfileSlice";
import adminMapReducer from "@/hooks/redux/redux-slices/adminMapSlice"
import adminCrimeReducer from "@/hooks/redux/redux-slices/adminCrimeSlice"
import adminProfileReducer from "@/hooks/redux/redux-slices/profile/adminSlice"
export const store = configureStore({
  reducer: {
    userSafty: userSaftyReducer,
    userSession: userSessionReducer,
    userProfile: userProfileReducer,
    adminMap: adminMapReducer,
    adminCrimeReport: adminCrimeReducer,
    adminProfile:adminProfileReducer
  },
});
