import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import userApi from "./user";

const baseUrl = import.meta.env.VITE_BASE_URL + "/product";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["NewArrivals"],
  endpoints: (build) => ({
    getNewArrivals: build.query({
      query: () => "/new-arrivals",
      providesTags: ["NewArrivals"],
    }),
    toggleWish: build.mutation({
      query: (body) => ({
        url: "/toggle-wish",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NewArrivals"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(userApi.util.invalidateTags(["Wishlist"]));
        } catch (error) {}
      },
    }),
  }),
});

export const { useGetNewArrivalsQuery, useToggleWishMutation } = productsApi;
export default productsApi;
