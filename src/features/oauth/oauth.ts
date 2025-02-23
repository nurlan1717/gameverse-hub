import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ADMIN_URL_BASE } from "../../constants/api";

export const oauthApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ADMIN_URL_BASE,
    credentials: "include", 
  }),
  endpoints: (builder) => ({
    googleLogin: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "auth/google",
        method: "GET",
      }),
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "auth/logout",
        method: "GET",
      }),
    }),
  }),
});

export const { useGoogleLoginMutation, useLogoutMutation } = oauthApi;
