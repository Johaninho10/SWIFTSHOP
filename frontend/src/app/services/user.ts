import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL + "/user";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl, credentials: "include" }),
  tagTypes: ["Wishlist"],
  endpoints: (build) => ({
    getUser: build.query({
      query: () => "/",
    }),
    getWishlist: build.query({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),
    getCart: build.query({
      query: () => "/cart",
    }),
  }),
});

export const { useGetUserQuery, useGetWishlistQuery, useGetCartQuery } =
  userApi;
export default userApi;
