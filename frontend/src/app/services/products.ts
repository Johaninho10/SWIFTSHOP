import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import userApi from "./user";

const baseUrl = import.meta.env.VITE_BASE_URL + "/product";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["NewArrivals", "Product", "Products", "Similar"],
  endpoints: (build) => ({
    fetchProducts: build.query({
      query: ({
        q,
        category,
        subCategory,
        page = 1,
      }: {
        q?: string;
        category?: string;
        subCategory?: string;
        page: number;
      }) => {
        const searchParams = new URLSearchParams();

        if (q?.trim()) {
          searchParams.append("query", q.trim());
        }

        if (category) {
          searchParams.append("category", category);
        }

        if (subCategory) {
          searchParams.append("subCategory", subCategory);
        }

        searchParams.append("page", page.toString());

        return "?" + searchParams.toString();
      },
      providesTags: ["Products"],
    }),
    getProduct: build.query({
      query: (id) => `/${id}`,
      providesTags: ["Product"],
    }),
    getSimilarProducts: build.query({
      query: (id: string) => `/similar/${id}`,
      providesTags: ["Similar"],
    }),
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
      invalidatesTags: ["NewArrivals", "Products", "Product", "Similar"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(userApi.util.invalidateTags(["Wishlist"]));
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useGetNewArrivalsQuery,
  useGetProductQuery,
  useToggleWishMutation,
  useFetchProductsQuery,
  useGetSimilarProductsQuery,
} = productsApi;
export default productsApi;
