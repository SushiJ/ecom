import { useParams, Link } from "react-router-dom";
import { Col, Row, Image, ListGroup, Card, Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useGetProductsByIdQuery } from "../features/products/slice";

export function Product() {
  const { id } = useParams() as { id: string };
  const { data, isError, isLoading } = useGetProductsByIdQuery(id);

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
              <ListGroup.Item>
                <Button
                  className="btn btn-primary"
                  type="button"
                  disabled={data.countInStock === 0}
                >
                  Add to bag
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
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
