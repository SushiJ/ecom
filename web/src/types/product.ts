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
