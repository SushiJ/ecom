import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  Alert,
} from "react-bootstrap";

import Loader from "../components/Loader";
import { useGetOrderDetailsQuery } from "../features/orders/slice";

import { useAppSelector } from "../hooks/redux";

const OrderScreen = () => {
  const { id: orderId } = useParams() as { id: string };

  const { data, isLoading, error } = useGetOrderDetailsQuery(orderId);

  const { userInfo } = useAppSelector((state) => state.auth);

  if (!data) {
    return <Alert variant="danger">{JSON.stringify(error)}</Alert>;
  }
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Alert variant="danger">{JSON.stringify(error)}</Alert>
  ) : (
    <>
      <h1>Order {data._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {data.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${data.user.email}`}>{data.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {data.shippingAddress.address}, {data.shippingAddress.city}{" "}
                {data.shippingAddress.postalCode},{" "}
                {data.shippingAddress.country}
              </p>
              {data.isDelivered && data.deliveredAt ? (
                <Alert variant="success">
                  Delivered on {new Date(data.deliveredAt).toString()}
                </Alert>
              ) : (
                <Alert variant="danger">Not Delivered</Alert>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {data.paymentMethod}
              </p>
              {data.isPaid ? (
                <Alert variant="success">
                  Paid on{" "}
                  {data.paidAt ? new Date(data.paidAt).toString() : "Not paid"}
                </Alert>
              ) : (
                <Alert variant="danger">Not Paid</Alert>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>data Items</h2>
              {data.orderItems.length === 0 ? (
                <Alert>data is empty</Alert>
              ) : (
                <ListGroup variant="flush">
                  {data.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.quantity} x ${item.price} = $
                          {item.quantity * item.price}
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
                <h2>data Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${data.productsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${data.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${data.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${data.totalAmount}</Col>
                </Row>
              </ListGroup.Item>
              {/* {!data.isPaid && ( */}
              {/* <ListGroup.Item> */}
              {/*   {loadingPay && <Loader />} */}
              {/**/}
              {/*   {isPending ? ( */}
              {/*     <Loader /> */}
              {/*   ) : ( */}
              {/*     <div> */}
              {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
              {/* <Button
                        style={{ marginBottom: '10px' }}
                        onClick={onApproveTest}
                      >
                        Test Pay data
                      </Button> */}

              {/* <div> */}
              {/*   <PayPalButtons */}
              {/*     createdata={createOrder} */}
              {/*     onApprove={onApprove} */}
              {/*     onError={onError} */}
              {/*   ></PayPalButtons> */}
              {/* </div> */}
              {/*       </div> */}
              {/*     )} */}
              {/*   </ListGroup.Item> */}
              {/* )} */}

              {userInfo &&
                userInfo.isAdmin &&
                data.isPaid &&
                !data.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={() => {}}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
