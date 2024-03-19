import { Link, useParams } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import { Icon } from "@iconify/react";

import { Product } from "../types/product";
import { useGetProductsQuery } from "../features/products/slice";

import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";

export default function Home() {
  const { pageNum, keyword } = useParams();
  const { data, isError, isLoading } = useGetProductsQuery({
    pageNum,
    keyword,
  });

  if (isLoading) {
    return (
      <>
        <h1>Latest Products</h1>
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
    <main className="d-flex flex-column">
      <h1>Latest Products</h1>
      <ProductCarousel />
      <Row>
        {data.products.map((p) => (
          <Col key={p._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={p} />
          </Col>
        ))}
      </Row>
      <Paginate pages={data.pages} page={data.page} keyword={keyword} />
    </main>
  );
}

function Product(props: { product: Product }) {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/products/${props.product._id}`}>
        <Card.Img src={props.product.image} variant="top" className="rounded" />
      </Link>
      <Card.Body>
        <Link to={`/products/${props.product._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{props.product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={props.product.rating}
            text={`${props.product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as={"h3"}>${props.product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
}

function Rating(props: { value: number; text: string }) {
  return (
    <div className="rating">
      <RenderRatingIcon value={props.value} />
      <span className="rating-text">{props.text ?? props.text}</span>
    </div>
  );
}

function RenderRatingIcon(props: { value: number }) {
  return (
    <>
      <span>
        {[1, 2, 3, 4, 5].map((num, idx) =>
          props.value >= num ? (
            <Icon
              key={idx}
              icon="fluent:star-12-filled"
              width="20"
              height="20"
            />
          ) : props.value >= num - 0.5 ? (
            <Icon
              key={idx}
              icon="fluent:star-half-12-regular"
              width="20"
              height="20"
            />
          ) : (
            <Icon
              key={idx}
              icon="fluent:star-12-regular"
              width="20"
              height="20"
            />
          ),
        )}
      </span>
    </>
  );
}
