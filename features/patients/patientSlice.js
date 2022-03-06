import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import patientService from "./patientService";

const initialState = {
  patients: [],
  isError: false,
  isSuccess: false,
  isLoadingPatients: false,
  message: "",
  isUpdatingPatient: false,
  isUpdatingPatientSuccess: false,
  isUpdatingPatientError: false,
  isUpdatingPatientMessage: false,
};

// get patients registered receptionist
export const getPatientsForRecep = createAsyncThunk(
  "rececptionists/getall",
  async (next_page_url, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.authDetails.access_token;
      return await patientService.getPatientsRegisteredByReceptionist(
        next_page_url,
        accessToken
      );
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// update patient details
export const updatePatientDetails = createAsyncThunk(
  "patients/update",
  async (data, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.authDetails.access_token;
      const { url } = data;
      return await patientService.updatePatientDetails(accessToken, url, data);
    } catch (error) {
      if (error?.response?.data?.date_of_birth) {
        return thunkAPI.rejectWithValue(error?.response.data.date_of_birth.join(' '));
      }
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.non_field_errors.join(' ')) ||
        error.response.data.message ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    resetPatient: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPatientsForRecep.pending, (state) => {
        state.isLoadingPatients = true;
      })
      .addCase(getPatientsForRecep.fulfilled, (state, action) => {
        state.isLoadingPatients = false;
        state.isSuccess = true;
        // reset to empty and push
        state.patients = []
        state.patients.push(action.payload);
      })
      .addCase(getPatientsForRecep.rejected, (state, action) => {
        state.isLoadingPatients = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updatePatientDetails.pending, (state) =>{
        state.isUpdatingPatient = true
      })
      .addCase(updatePatientDetails.fulfilled, (state, action) => {
        state.isUpdatingPatient = false
        state.isUpdatingPatientSuccess = true;
      })
      .addCase(updatePatientDetails.rejected, (state, action) => {
        state.isUpdatingPatient = false
        state.isUpdatingPatientError = true;
        state.isUpdatingPatientMessage = action.payload;
      })
  },
});

export const { resetPatient } = patientSlice.actions;
export default patientSlice.reducer;
