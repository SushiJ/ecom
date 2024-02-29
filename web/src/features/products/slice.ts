import {
  Product,
  ProductApiResponse,
  UpdateProductMutation,
} from "../../types/product.ts";
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
    createProduct: builder.mutation<void, void>({
      query: () => ({
        url: `products`,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<unknown, UpdateProductMutation>({
      query: (data) => ({
        url: `products/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    uploadProductImage: builder.mutation<unknown, string>({
      query: (data) => ({
        url: `/api/upload`,
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation<unknown, string>({
      query: (productId) => ({
        url: `products/${productId}`,
        method: "DELETE",
        providesTags: ["Product"],
      }),
    }),
    getTopProducts: builder.query<Array<Product>, void>({
      query: () => `products/top`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useGetTopProductsQuery,
} = productApiSlice;
