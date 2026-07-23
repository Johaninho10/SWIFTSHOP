import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
