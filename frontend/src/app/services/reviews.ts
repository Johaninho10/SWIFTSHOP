import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import productsApi from "./products";

const baseUrl = import.meta.env.VITE_BASE_URL + "/review";

const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Reviews", "Review"],
  endpoints: (build) => ({
    getReview: build.query({
      query: (id: string) => `/${id}`,
      providesTags: ["Review"],
    }),
    fetchReviews: build.query({
      query: ({
        productId,
        page = 1,
      }: {
        productId: string;
        page: number;
      }) => ({
        url: `/product/${productId}?page=${page}`,
      }),
      providesTags: ["Reviews"],
    }),
    createReviews: build.mutation({
      query: (body) => ({
        url: "/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reviews"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(productsApi.util.invalidateTags(["Product"]));
      },
    }),
    updateReview: build.mutation({
      query: ({ id, text, rate }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: {
          text,
          rate,
        },
      }),
      invalidatesTags: ["Reviews", "Review"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(productsApi.util.invalidateTags(["Product", "NewArrivals"]));
      },
    }),
    deleteReview: build.mutation({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(productsApi.util.invalidateTags(["Product"]));
      },
    }),
  }),
});

export const {
  useFetchReviewsQuery,
  useCreateReviewsMutation,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
  useGetReviewQuery,
} = reviewsApi;
export default reviewsApi;
