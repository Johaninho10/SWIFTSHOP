import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import productsApi from "./products";

const baseUrl = import.meta.env.VITE_BASE_URL + "/auth";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl, credentials: "include" }),
  endpoints: (build) => ({
    signUp: build.mutation({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body: body,
      }),
    }),

    signIn: build.mutation({
      query: (body) => ({
        url: "/signin",
        method: "POST",
        body,
      }),

      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(productsApi.util.invalidateTags(["NewArrivals"]));
        } catch (error) {}
      },
    }),

    verifyEmail: build.mutation({
      query: (body) => ({
        url: "/verify-email",
        method: "POST",
        body,
      }),
    }),

    resendCode: build.mutation({
      query: () => ({
        url: "/send-verification-otp",
        method: "POST",
      }),
    }),

    signOut: build.mutation({
      query: () => ({
        url: "/signout",
        method: "POST",
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(productsApi.util.invalidateTags(["NewArrivals"]));
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useVerifyEmailMutation,
  useResendCodeMutation,
  useSignOutMutation,
} = authApi;
export default authApi;
