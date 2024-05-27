import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthURL } from "../../config/config";
import { toast } from "react-toastify";

interface userDetails {
  name: string;
  email: string;
  loading: boolean;
}

const userDeatilsInitialState: userDetails = {
  loading: false,
  name: "",
  email: ""
};

export const getUserDetailsAction = createAsyncThunk(
  "/auth/user-info",
  async (_, thunkAPI) => {
    try {
      const { data } = await AuthURL.get(`/auth/user-info`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: userDeatilsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetailsAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserDetailsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload?.email;
        state.name = action.payload?.name;
      })
      .addCase(getUserDetailsAction.rejected, (state) => {
        state.loading = false;
      });
  }
});

export { userDetailsSlice };
