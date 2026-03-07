import { RootState } from "../rootRedux";

export const selectProfileCompletion = (state: RootState) =>
  state.userSession.profileCompletion;
export const SelectIsProfileComplete = (state: RootState) =>
  state.userSession.profileCompletion >= 100;
