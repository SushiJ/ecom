import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  ListGroup,
  Row,
  Image,
  Alert,
} from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useCreateOrderMutation } from "../features/orders/slice";

import CheckoutSteps from "../components/CheckoutSteps";
import Loader from "../components/Loader";
import { resetCart } from "../features/cart/slice";
import { toast } from "react-toastify";

function PlaceOrder() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cart = useAppSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const getItemPrice = (products: typeof cart.products) => {
    let ItemsPrice: number = 0;
    for (let i = 0; i < products.length; i++) {
      ItemsPrice += products[i].product.price * products[i].quantity;
    }
    return ItemsPrice;
  };

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderedProducts: cart.products,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        totalPrice: cart.totalAmount,
      }).unwrap();
      console.log(res);
      dispatch(resetCart());
      navigate(`/order/${res._id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err);
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                <br />
                {cart.shippingAddress.address},{cart.shippingAddress.city}
                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.products.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <ListGroup variant="flush">
                  {cart.products.map(({ product, quantity }, idx) => (
                    <ListGroup.Item key={idx}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={product.image}
                            alt={product.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${product._id}`}>
                            {product.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {quantity} x ${product.price} = $
                          {(quantity * (product.price * 100)) / 100}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${getItemPrice(cart.products)}</Col>
                </Row>
              </ListGroup.Item>
              {/*<ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <pre>${JSON.stringify(cart, null, 2)}</pre>
                </Row> 
              </ListGroup.Item>*/}
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalAmount}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && (
                  <Alert variant="danger">
                    {JSON.stringify(error, null, 2)}
                  </Alert>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.products.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrder;
