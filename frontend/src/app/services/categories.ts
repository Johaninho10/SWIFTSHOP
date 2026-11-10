import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL + "/category";

const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    getPopularCategories: build.query({
      query: () => "/popular",
    }),
    getCategories: build.query({
      query: () => "/",
    }),
  }),
});

export const { useGetPopularCategoriesQuery, useGetCategoriesQuery } =
  categoriesApi;
export default categoriesApi;
