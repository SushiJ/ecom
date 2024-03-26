import { Alert, Carousel, Image } from "react-bootstrap";
import { useGetTopProductsQuery } from "../features/products/slice";
import { Link } from "react-router-dom";
import Loader from "./Loader";

function ProductCarousel() {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && error) {
    return (
      <>
        <h1>Some went wrong</h1>
        <Alert variant="danger">{JSON.stringify(error, null, 2)}</Alert>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </>
    );
  }

  if (!products) {
    return <>No Products</>;
  }

  return (
    <Carousel pause="hover" className="bg-primary mb-4">
      {products!.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/products/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h2 className="text-white text-right">
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ProductCarousel;
