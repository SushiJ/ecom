import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Product } from "../types/product";
import { useGetProductsQuery } from "../features/products/slice";

import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { Rating } from "@/components/Rating";
import truncate from "../lib/truncate";

export default function Home() {
  const { pageNum, keyword } = useParams();
  const { data, isError, isLoading } = useGetProductsQuery({
    pageNum,
    keyword,
  });

  if (isLoading) {
    return (
      <>
        {/* <h1>Latest Products</h1> */}
        <p>Loading...</p>
      </>
    );
  }

  if ((!data || isError) && !isLoading) {
    return (
      <>
        <p>Something went wrong</p>
      </>
    );
  }

  if (data.products.length < 1) {
    return (
      <>
        <p>No Products found</p>
      </>
    );
  }

  return (
    <section>
      <h1 className="text-center italic text-neutral-500">Latest Products</h1>
      <ProductCarousel />
      <Separator className="my-8" />
      <div className="grid grid-cols-2 gap-2">
        {data.products.map((p) => (
          <div key={p._id}>
            <Product product={p} />
          </div>
        ))}
      </div>
      <Paginate pages={data.pages} page={data.page} keyword={keyword} />
    </section>
  );
}

function Product(props: { product: Product }) {
  return (
    <Card className="shadow-none h-[450px]">
      <Link to={`/products/${props.product._id}`}>
        <CardHeader className="flex flex-col items-center">
          <img
            src={props.product.image}
            className="rounded h-48 w-48 object-cover"
          />
          <CardTitle>{props.product.name}</CardTitle>
          <CardDescription>
            {truncate(props.product.description)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>$ {props.product.price}</p>
          <Rating
            value={props.product.rating}
            text={`${props.product.numReviews} reviews`}
          />
        </CardContent>
      </Link>
    </Card>
  );
}
