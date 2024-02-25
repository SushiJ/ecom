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
import {
  PayPalButtons,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../features/orders/slice";

import { useAppSelector } from "../hooks/redux";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import {
  CreateOrderActions,
  OnApproveActions,
  OnApproveData,
} from "../types/paypal";

const OrderScreen = () => {
  const { id: orderId } = useParams() as { id: string };
  const { userInfo } = useAppSelector((state) => state.auth);

  const {
    data: order,
    isLoading: isOrderLoading,
    refetch,
    error: errorOrder,
  } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const {
    data: paypal_id,
    isLoading: loadingPaypalId,
    error: errorPaypalId,
  } = useGetPaypalClientIdQuery();

  const [{ isPending, options }, paypalDispatch] = usePayPalScriptReducer();

  const loadPayPalScript = useCallback(() => {
    return async function () {
      paypalDispatch({
        type: "resetOptions",
        value: {
          ...options,
          clientId: paypal_id!.clientId,
          //TODO: Change this to INR later
          currency: "USD",
        },
      });
      paypalDispatch({
        type: "setLoadingStatus",
        value: {
          state: SCRIPT_LOADING_STATE.PENDING,
          message: "pending",
        },
      });
    };
  }, [options, paypalDispatch, paypal_id]);

  //INFO: IDK what I'm doing Smile
  useEffect(() => {
    if (
      !errorPaypalId &&
      !loadingPaypalId &&
      paypal_id &&
      order &&
      !order.isPaid &&
      !window.paypal
    ) {
      loadPayPalScript();
    }
  }, [order, errorPaypalId, loadPayPalScript, loadingPaypalId, paypal_id]);

  async function onApprove(_: OnApproveData, actions: OnApproveActions) {
    return actions.order?.capture().then(async function (details) {
      try {
        console.log({ orderId, details });
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onError(err: any) {
    toast.error(err.message);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function createOrder(_: any, actions: CreateOrderActions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order!.totalAmount.toString() },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  // TESTING ONLY! REMOVE BEFORE PRODUCTION
  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();
  //
  //   toast.success("Order is paid");
  // }

  // const deliverHandler = async () => {
  //   await deliverOrder(orderId);
  //   refetch();
  // };

  if (!order) {
    return <Alert variant="danger">"No order found for that Id"</Alert>;
  }

  return isOrderLoading ? (
    <Loader />
  ) : errorOrder ? (
    <Alert variant="danger">{JSON.stringify(errorOrder)}</Alert>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
              </p>
              {order.isDelivered && order.deliveredAt ? (
                <Alert variant="success">
                  Delivered on {new Date(order.deliveredAt).toString()}
                </Alert>
              ) : (
                <Alert variant="danger">Not Delivered</Alert>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Alert variant="success">
                  Paid on{" "}
                  {order.paidAt
                    ? new Date(order.paidAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not paid"}
                </Alert>
              ) : (
                <Alert variant="danger">Not Paid</Alert>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>

              {order.orderItems.length <= 0 ? (
                <Alert>data is empty</Alert>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
                <h2>Data Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.productsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalAmount}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
                      {/* <Button */}
                      {/*   style={{ marginBottom: "10px" }} */}
                      {/*   onClick={onApproveTest} */}
                      {/* > */}
                      {/*   Test Pay data */}
                      {/* </Button> */}
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
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
