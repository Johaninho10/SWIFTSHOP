import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL + "/user";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl, credentials: "include" }),
  endpoints: (builder) => ({
    getUser: builder.query({
        query: () => "/"
    })
  })
});


export const {useGetUserQuery} = userApi
export default userApi