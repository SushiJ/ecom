import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Col,
  Row,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";

import { useGetProductsByIdQuery } from "../features/products/slice";
import { addToCart } from "../features/cart/slice";
import { useAppDispatch } from "../hooks/redux";
import Reviews from "../components/Reviews";
import { Rating } from "../components/Rating";

export default function Product() {
  const dispatch = useAppDispatch();
  const { id } = useParams() as { id: string };
  const [quantity, setQuantity] = useState(1);
  const { data, isError, isLoading } = useGetProductsByIdQuery(id);

  // TODO: Spinner component
  if (isLoading) <p>Loading...</p>;

  if (isError && !isLoading) {
    return (
      <>
        <Link className="my-3 btn btn-outline-primary" to="/">
          Go Back
        </Link>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Link className="my-3 btn btn-outline-primary" to="/">
          Go Back
        </Link>
        <p>Something went wrong</p>
      </>
    );
  }

  return (
    <>
      <Link className="my-3 btn btn-outline-primary" to="/">
        Go Back
      </Link>
      <Row className="my-5">
        <Col md="5">
          <Image src={data.image} alt={data.name} fluid className="rounded" />
        </Col>
        <Col md="4">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{data.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating value={data.rating} text={`${data.numReviews} reviews`} />
            </ListGroup.Item>
            <ListGroup.Item>{data.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md="3">
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${data.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    <strong>
                      {data.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              {data.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={quantity}
                        onChange={(e) => setQuantity(+e.target.value)}
                      >
                        {Array.from(Array(data.countInStock).keys(), (v) => {
                          return (
                            <option key={v + 1} value={v + 1}>
                              {v + 1}
                            </option>
                          );
                        })}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Button
                  className="btn btn-primary"
                  type="button"
                  disabled={data.countInStock === 0}
                  onClick={() => dispatch(addToCart({ data, quantity }))}
                >
                  Add to bag
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Reviews isLoading={isLoading} id={id} reviews={data.reviews} />
    </>
  );
}
