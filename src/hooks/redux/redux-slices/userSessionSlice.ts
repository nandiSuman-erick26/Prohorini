import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UserSessionState {
  profileCompletion: number
}

const initialState: UserSessionState = {
  profileCompletion: 0,
}

const userSessionSlice = createSlice({
  name: "userSession",
  initialState,
  reducers: {
    setProfileCompletion(state, action: PayloadAction<number>) {
      state.profileCompletion = action.payload
    },
    resetSessionState() {
      return initialState
    },
  },
})

export const { setProfileCompletion, resetSessionState } =
  userSessionSlice.actions

export default userSessionSlice.reducer