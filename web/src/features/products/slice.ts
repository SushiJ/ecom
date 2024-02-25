import { ProductApiResponse } from "../../types/product.ts";
import { api } from "../api.ts";

export const productApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductApiResponse[], void>({
      query: () => `products`,
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    getProductsById: builder.query<ProductApiResponse, string>({
      query: (id: string) => `products/${id}`,
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductsByIdQuery } = productApiSlice;
