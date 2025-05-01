import { TAuthSlice } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TAuthSlice = {
  user: null,
  token: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAuth: (state, { payload }: PayloadAction<TAuthSlice>) => {
      const { user, isLoading, token } = payload;
      state.user = user;
      state.isLoading = isLoading;
      state.token = token;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
    },
  },
});

export const { setAuth, logOut } = authSlice.actions;

export default authSlice.reducer;
