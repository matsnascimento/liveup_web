import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { modifyResponseMessage } from "../../utils/messages";
import referralService from "./refferralService";

const initialState = {
  referrals: [],
  singleReferral: [],
  isReferringError: false,
  isReferringSuccess: false,
  isReferring: false,
  referringMessage: "",
};


//Get singleReferral
export const referPatient = createAsyncThunk(
  "receptionist/refer",
  async (referal, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.authDetails.access_token;
      return await referralService.referPatient(accessToken, referal);
    } catch (error) {
      const message = modifyResponseMessage(error)
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const clinicianSlice = createSlice({
  name: "clinician",
  initialState,
  reducers: {
    resetClinician: (state) => initialState,
    resetLoadingCliniciansError: (state) => {
      state.isReferringError = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(referPatient.pending, (state) => {
        state.isReferring = true;
      })
      .addCase(referPatient.fulfilled, (state, action) => {
        state.isReferring = false;
        state.isReferringSuccess = true;
        // reset to empty and push
        state.singleReferral = []
        state.singleReferral.push(action.payload);
      })
      .addCase(referPatient.rejected, (state, action) => {
        state.isReferring = false;
        state.isReferringError = true;
        state.referringMessage = action.payload;
      })

  },
});

export const { resetLoadingCliniciansError, resetClinician } = clinicianSlice.actions;
export default clinicianSlice.reducer;
