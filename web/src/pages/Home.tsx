import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

import { useEffect, useState } from "react";

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

const FETCH_URL = "http://localhost:3000/products";

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetch(FETCH_URL)
      .then((res) => {
        if (!res.ok) {
          setError(true);
          return;
        }
        res.json().then((data) => {
          setProducts(data);
        });
      })
      .catch((e) => {
        setError(true);
        console.error(e);
      });
  }, []);

  if (error) {
    return (
      <>
        <h1>Latest Products</h1>
        <p>{error}</p>
      </>
    );
  }

  if (products.length < 1) {
    return (
      <>
        <h1>Latest Products</h1>
        <p>No Products found</p>
      </>
    );
  }

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((p) => (
          <Col key={p._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={p} />
          </Col>
        ))}
      </Row>
    </>
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
