import config from "@/config";
import { TAuthUser } from "@/types";
import { BaseQueryFn, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { jwtDecode } from "jwt-decode";
import { logOut, setAuth } from "./features/auth/authSlice";
import { RootState } from "./store";

const baseUrl = `${config.base_api_url}`;

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("authorization", `Bearer ${token}`);

    return headers;
  },
});

// Create a custom base query that handles token refresh
const baseQueryWithRefreshToken: BaseQueryFn = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  // Check for 401 Unauthorized response
  if (result?.error?.status === 401) {
    // Request for getting access token
    const res = await fetch(`${baseUrl}/auth/access-token`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    const token = data.data?.token;
    // Check if we received a new access token
    if (token) {
      const user = jwtDecode(data.data?.token) as TAuthUser;

      // Ensure user is not null before dispatching setUser
      if (user) {
        api.dispatch(
          setAuth({
            user: user,
            token: data.data.token,
            isLoading: false,
          })
        );
      }
      // Retry the original request with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // If no new token, log out the user
      api.dispatch(logOut());
    }
  }
  return result;
};

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  endpoints: () => ({}),
  tagTypes: [],
});

export default baseApi;
