import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import userApi from "./user";

const baseUrl = import.meta.env.VITE_BASE_URL + "/product";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  endpoints: (build) => ({
    getNewArrivals: build.query({
      query: () => "/new-arrivals",
      keepUnusedDataFor: 0
    }),
    toggleWish: build.mutation({
      query: (body) => ({
        url: "/toggle-wish",
        method: "POST",
        body,
      }),
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
