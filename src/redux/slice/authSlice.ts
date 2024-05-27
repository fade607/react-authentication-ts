import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthURL } from "../../config/config";
import { toast } from "react-toastify";

interface AuthState {
  loading: boolean;
  error: string | null;
  token: string | null;
  authenticated: boolean;
  errorCode: number | null;
}

interface requestOTPState {
  loading: boolean;
  error: string | null;
  allowResendOTP: boolean;
  period: number;
}

type registerTypes = {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
  otp?: string;
};

const initialState: AuthState = {
  loading: false,
  error: null,
  token: null,
  authenticated: false,
  errorCode: null
};

const requestOTPInitialState: requestOTPState = {
  loading: false,
  error: null,
  allowResendOTP: true,
  period: 0
};

export const registerAction = createAsyncThunk(
  "auth/signup",
  async (newUser: registerTypes, thunkAPI) => {
    try {
      const response = await AuthURL.post("/auth/signup", newUser);
      localStorage.setItem("token", response.data);
      window.location.href = "/";
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response ? error.response?.data.message : error.message
      );
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const registerWithVerifyOTPAction = createAsyncThunk(
  "auth/signup-with-otp",
  async (newUser: registerTypes, thunkAPI) => {
    try {
      const response = await AuthURL.post(
        "/auth/create-account-with-otp",
        newUser
      );
      localStorage.setItem("token", response.data);
      window.location.href = "/";
      return response.data;
    } catch (error: any) {

      const errorMessage = Array.isArray(error.response?.data.message)
        ? error.response?.data.message.join("& ")
        : error.response?.data
        ? error.response?.data.message
        : error.message;
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue({
        error: errorMessage,
        errorCode: error.response?.status
      });
    }
  }
);

const registerSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAction.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.authenticated = true;
      })

      .addCase(registerAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerWithVerifyOTPAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWithVerifyOTPAction.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.authenticated = true;
      })
      .addCase(registerWithVerifyOTPAction.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any).error as string;
        state.errorCode = (action.payload as any).errorCode as number;
      });
  }
});

type LoginFormInputs = {
  email: string;
  password: string;
};

export const signinAction = createAsyncThunk(
  "auth/signin",
  async (user: LoginFormInputs, thunkAPI) => {
    try {
      const response = await AuthURL.post("/auth/signin", user);
      localStorage.setItem("token", response.data);
      window.location.href = "/";
      return response.data;
    } catch (error: any) {
      const errorMessage = Array.isArray(error.response?.data.message)
        ? error.response?.data.message.join("& ")
        : error.response?.data
        ? error.response?.data.message
        : error.message;
      return thunkAPI.rejectWithValue({
        error: errorMessage,
        errorCode: error.response?.status
      });
    }
  }
);

export const logoutAction = createAsyncThunk("/", async (_, thunkAPI) => {
  try {
    const response = await AuthURL.post("/auth/signout");
    localStorage.removeItem("token");
    window.location.href = "/";

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response || error.message);
  }
});

const signinSlice = createSlice({
  name: "signin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signinAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinAction.fulfilled, (state, action) => {
        state.loading = true;
        state.token = action.payload;
        state.authenticated = true;
      })
      .addCase(signinAction.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any).error as string;
        state.errorCode = (action.payload as any).errorCode as number;
      })
      .addCase(logoutAction.fulfilled, (state, action) => {
        state.loading = false;
        state.authenticated = false;
        state.error = null;
      });
  }
});

export const requestOTPAction = createAsyncThunk(
  "auth/send-otp",
  async (userEmail: string, thunkAPI) => {
    try {
      const response = await AuthURL.post("/auth/send-otp", {
        email: userEmail
      });
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response ? error.response?.data.message : error.message
      );
      return thunkAPI.rejectWithValue(
        error.response ? error.response?.data.message : error.message
      );
    }
  }
);

export const handleAllowResend = createAsyncThunk(
  "auth/allow-resend-otp",
  async (_, thunkAPI) => {
    return true;
  }
);

export const changePasswordStep1Action = createAsyncThunk(
  "auth/change-password/step1",

  async (userEmail: string, thunkAPI) => {
    try {
      const response = await AuthURL.post("/auth/change-password/step1", {
        email: userEmail
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response?.data.message : error.message
      );
    }
  }
);

const requestOTPSlice = createSlice({
  name: "requestOTP",
  initialState: requestOTPInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // request otp
      .addCase(requestOTPAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.allowResendOTP = false;
      })
      .addCase(requestOTPAction.fulfilled, (state, action) => {
        state.loading = false;
        state.allowResendOTP = false;
        state.period = 2;
      })
      .addCase(requestOTPAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.allowResendOTP = true;
        state.period = 0;
      })
      // change password step 1

      .addCase(changePasswordStep1Action.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.allowResendOTP = false;
      })
      .addCase(changePasswordStep1Action.fulfilled, (state, action) => {
        state.loading = false;
        state.allowResendOTP = false;
        state.period = 2;
      })
      .addCase(changePasswordStep1Action.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.allowResendOTP = true;
        state.period = 0;
      })

      // allow resend
      .addCase(handleAllowResend.fulfilled, (state, action) => {
        state.loading = false;
        state.allowResendOTP = true;
      });
  }
});

type updatePasswordStep2State = {
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
};

export const updatePasswordStep2Action = createAsyncThunk(
  "auth/change-password/step2",
  async (newPassword: updatePasswordStep2State, thunkAPI) => {
    try {
      const response = await AuthURL.post(
        "/auth/change-password/step2",
        newPassword
      );
      window.location.href = "/";
      return response.data;
    } catch (error: any) {

      const errorMessage = Array.isArray(error.response?.data.message)
        ? error.response?.data.message.join("& ")
        : error.response?.data
        ? error.response?.data.message
        : error.message;
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue({
        error: errorMessage,
        errorCode: error.response?.status
      });
    }
  }
);

export { signinSlice, registerSlice, requestOTPSlice };
