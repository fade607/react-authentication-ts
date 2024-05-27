import { configureStore } from "@reduxjs/toolkit";
import { signinSlice, registerSlice, requestOTPSlice } from "./slice/authSlice";
import { userDetailsSlice } from "./slice/appSlice";

export const store = configureStore({
  reducer: {
    signup: registerSlice.reducer,
    signin: signinSlice.reducer,
    userDetails: userDetailsSlice.reducer,
    requestOTP: requestOTPSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
