import {
  CreateProductReviewMutation,
  Product,
  ProductApiResponse,
  ProductsPaginated,
  UpdateProductMutation,
} from "../../types/product.ts";
import { api } from "../api.ts";

export const productApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      ProductsPaginated,
      { pageNum: string | undefined }
    >({
      query: ({ pageNum }) => ({
        url: `products`,
        params: {
          pageNum,
        },
      }),
      providesTags: ["Products"],
      keepUnusedDataFor: 5,
    }),
    getProductsById: builder.query<ProductApiResponse, string>({
      query: (id: string) => `products/${id}`,
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
      invalidatesTags: ["Products"],
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
    createProductReviews: builder.mutation<
      unknown,
      CreateProductReviewMutation
    >({
      query: (data) => ({
        url: `products/reviews/${data.id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
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
  useCreateProductReviewsMutation,
} = productApiSlice;
