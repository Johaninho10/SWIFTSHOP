import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL + "/cart";

const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  endpoints: (build) => ({
    addToCart: build.mutation({
      query: (body) => ({
        url: "/add-to-cart",
        method: "POST",
        body,
      }),
    }),
    updateCart: build.mutation({
      query: (body) => ({
        url: "/update-cart",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const { useAddToCartMutation, useUpdateCartMutation } = cartApi;
export default cartApi;
