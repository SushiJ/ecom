import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useGetTopProductsQuery } from "../features/products/slice";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { Card } from "./ui/card";

function ProductCarousel() {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && error) {
    return (
      <>
        <h1>Some went wrong</h1>
        {/* <Alert variant="danger">{JSON.stringify(error, null, 2)}</Alert> */}
      </>
    );
  }

  if (!products) {
    return <>No Products</>;
  }

  return (
    <Carousel className="w-full max-w-xl my-4 mx-auto">
      <CarouselPrevious />
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product._id}>
            <Card className="shadow-none">
              <Link to={`/products/${product._id}`} className="text-center">
                <img src={product.image} alt={product.name} />
                <h1>{product.name}</h1>
                <p>${product.price}</p>
              </Link>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  );
}

export default ProductCarousel;
