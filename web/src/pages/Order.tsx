import { Link, useParams } from "react-router-dom";
import { Fragment, useCallback, useEffect } from "react";
import { toast } from "react-toastify";

import {
  DISPATCH_ACTION,
  PayPalButtons,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../features/orders/slice";
import { useAppSelector } from "../hooks/redux";

import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  type CreateOrderActions,
  type OnApproveActions,
  type OnApproveData,
} from "../types/paypal";
import { Button } from "@/components/ui/button";

const OrderScreen = () => {
  const { id: orderId } = useParams() as { id: string };
  const { userInfo } = useAppSelector(state => state.auth);

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

  const [updateOrderToDelivered] = useDeliverOrderMutation();

  const loadPayPalScript = useCallback(() => {
    return async function () {
      paypalDispatch({
        type: DISPATCH_ACTION.RESET_OPTIONS,
        value: {
          ...options,
          clientId: paypal_id!.clientId,
          //TODO: Change this to INR later
          currency: "USD",
        },
      });
      paypalDispatch({
        type: DISPATCH_ACTION.LOADING_STATUS,
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

  async function onApprove(_data: OnApproveData, actions: OnApproveActions) {
    return actions.order?.capture().then(async function (details) {
      try {
        console.log({ orderId, details });
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (err: any) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  function onError(err: any) {
    toast.error(err.message);
  }

  async function createOrder(_: any, actions: CreateOrderActions) {
    return actions.order
      .create({
        intent: "AUTHORIZE",
        purchase_units: [
          {
            amount: {
              value: order!.totalAmount.toString(),
              currency_code: "USD",
            },
          },
        ],
      })
      .then(orderID => {
        return orderID;
      });
  }

  // TESTING ONLY! REMOVE BEFORE PRODUCTION
  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();

    toast.success("Order is paid");
  }

  const deliverHandler = async () => {
    await updateOrderToDelivered(orderId);
    refetch();
  };

  if (!order) {
    return <div>"No order found for that Id"</div>;
  }

  return (
    <Fragment>
      <h1 className="text-sm text-center my-8 italic">Order {order._id}</h1>
      {isOrderLoading ? (
        <Loader />
      ) : errorOrder ? (
        <pre>{JSON.stringify(errorOrder)}</pre>
      ) : (
        <div>
          <div className="flex justify-between">
            <div>
              <div className="space-y-8">
                <div className="space-y-1">
                  <h2 className="text-sm italic underline">Contact Info &minus;</h2>
                  <p className="text-md italic">{order.user.name}</p>
                  <a href={`mailto:${order.user.email}`} className="underline">
                    {order.user.email}
                  </a>
                </div>
                <div>
                  <h2 className="text-sm italic underline">Shipping Info &minus;</h2>
                  <p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}</p>
                    <p>{order.shippingAddress.postalCode}</p>
                  </p>
                </div>
                <div className="">
                  <p className="text-sm italic font-semibold">Shipping Status</p>
                  {order.isDelivered && order.deliveredAt ? (
                    <Badge variant="outline">
                      Delivered on
                      {new Date(order.deliveredAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Not Delivered</Badge>
                  )}
                </div>
              </div>
              <Separator className="my-8" />
              <div>
                <div className="flex mt-4">
                  <h2 className="text-md italic font-semibold">Payment Method &minus;</h2>
                  <Badge variant="outline" className="text-sm italic ml-2 font-normal">
                    {order.paymentMethod}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <p className="text-sm italic">Status</p>
                  {order.isPaid ? (
                    <Badge variant="outline">
                      Paid on
                      {order.paidAt
                        ? new Date(order.paidAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Not Paid</Badge>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-sm text-center italic mb-4">Order Items</h2>
              {order.orderItems.length <= 0 ? (
                <p>data is empty</p>
              ) : (
                <div className="max-h-[400px] overflow-y-auto px-2 space-y-4 py-4">
                  {order.orderItems.map((item, index) => (
                    <div key={index}>
                      <div>
                        <div className="rounded">
                          <img src={item.image} alt={item.name} className="h-56 rounded" />
                        </div>
                        <div className="w-full">
                          <Link to={`/products/${item._id}`} className="text-sm italic underline">
                            {item.name}
                          </Link>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.quantity} x ${item.price} = $
                          {(item.quantity * (item.price * 100)) / 100}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Separator className="my-8" />
          <div className="mb-4">
            <h2 className="text-sm italic my-4 underline">Summary</h2>
            <div className="space-y-2">
              <div>
                <p>Items</p>
                <p>${order.productsPrice}</p>
              </div>
              <div>
                <p>Shipping</p>
                <p>${order.shippingPrice}</p>
              </div>
              <div>
                <p>Tax</p>
                <p>${order.taxPrice}</p>
              </div>
              <div>
                <p>Total</p>
                <p>${order.totalAmount}</p>
              </div>
              {!order.isPaid && (
                <div className="my-8">
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION!
                      <Button style={{ marginBottom: "10px" }} onClick={onApproveTest}>
                        Test Pay data
                      </Button>
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {userInfo && userInfo.role === "admin" && order.isPaid && !order.isDelivered && (
                <Button onClick={deliverHandler}>Mark As Delivered</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default OrderScreen;
