import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

import { products } from "../initialData.js";

export function Home() {
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

function Product(props: { product: (typeof products)[0] }) {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/products/${props.product._id}`}>
        <Card.Img src={props.product.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${props.product._id}`}>
          <Card.Title as={"div"}>
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
      {[1, 2, 3, 4, 5].map((n) => (
        <RenderRatingIcon value={props.value} num={n} />
      ))}
      <span>{props.text ?? props.text}</span>
    </div>
  );
}

function RenderRatingIcon(props: { value: number; num: number }) {
  return (
    <>
      <span>
        {props.value >= props.num ? (
          <Icon icon="fluent:star-12-filled" />
        ) : props.value > props.num + 0.5 ? (
          <Icon icon="fluent:star-half-12-filled" />
        ) : (
          <Icon icon="fluent:star-12-regular" />
        )}
      </span>
    </>
  );
}
