import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3000";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "same-origin" }),
  tagTypes: ["Product", "Order", "User"],
  endpoints: () => ({}),
});
