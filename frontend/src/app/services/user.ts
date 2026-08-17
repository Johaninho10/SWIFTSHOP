import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL + "/user";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl, credentials: "include" }),
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/",
    }),
    getWishlist: builder.query({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),
  }),
});

export const { useGetUserQuery, useGetWishlistQuery } = userApi;
export default userApi;
