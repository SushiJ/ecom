import {
  Col,
  ListGroup,
  Row,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { useAppSelector } from "../hooks/redux";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function CartPage() {
  const { products, totalAmount } = useAppSelector((state) => state.cart);
  if (products.length === 0) {
    return (
      <div>
        <h1 style={{ marginBottom: "20px" }}>Shopping Cart</h1>
        <p>
          Your cart is empty <Link to="/">Go back</Link>
        </p>
      </div>
    );
  }

  return (
    <Row>
      <Col md="8">
        <h1 style={{ marginBottom: "20px" }}>Shopping Cart</h1>
        <Link className="my-3 btn btn-outline-primary" to="/">
          Go Back
        </Link>
        <ListGroup variant="flush">
          {products.map(({ product, quantity }) => {
            return (
              <ListGroup.Item key={product._id}>
                <Row>
                  <Col md="2">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fluid
                      rounded
                    />
                  </Col>
                  <Col md="3">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </Col>
                  <Col md="2">
                    <p>${product.price}</p>
                  </Col>
                  <Col md="2">
                    <Form.Control
                      as="select"
                      value={quantity}
                      onChange={() => {}}
                    >
                      {Array.from(Array(product.countInStock).keys(), (v) => {
                        return (
                          <option key={v + 1} value={v + 1}>
                            {v + 1}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Col>
                  <Col md="2">
                    <Button type="button" variant="light">
                      <Icon
                        icon="fluent:delete-16-regular"
                        style={{ color: "#d9534f" }}
                        width="24"
                        height="24"
                      />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Col>
      <Col md="4">
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Subtotal ({products.length} items):</h2>$
              {totalAmount.toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={products.length === 0}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}
