import { ReportData } from "@/typeScript/types/crime";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminCrimeState {
  reports: ReportData[];
}

const initialState: AdminCrimeState = {
  reports: [],
};

const adminCrimeSlice = createSlice({
  name: "adminCrime",
  initialState,
  reducers: {
    setCrimeData: (state, action: PayloadAction<ReportData[]>) => {
      state.reports = action.payload;
    },
  },
});

export const { setCrimeData } = adminCrimeSlice.actions;
export default adminCrimeSlice.reducer;
