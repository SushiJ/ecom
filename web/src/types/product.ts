import { UserWithReview } from "./user";

type ValidationErrorDetails = {
  field: string;
  message: string;
};

export type ErrorResponse = {
  status: number;
  data: {
    error: string;
    message: string;
    details?: Array<ValidationErrorDetails>;
  };
};
export type Review = {
  _id: string;
  user: UserWithReview;
  rating: number;
  comment: string;
  createdAt?: string;
};

export type Product = {
  _id: string;
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews: Array<Review>;
};

export type ProductsPaginated = {
  products: Array<Product>;
  page: number;
  pages: number;
};

export type ProductApiResponse = Product;

export type UpdateProductMutation = {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  countInStock: number;
  description: string;
};

export type CreateProductReviewMutation = {
  id: string;
  comment: string;
  rating: number;
};
