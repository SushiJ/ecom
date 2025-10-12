import { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useCreateOrderMutation } from "../features/orders/slice";
import { resetCart } from "../features/cart/slice";

import CheckoutSteps from "@/components/CheckoutSteps";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function PlaceOrder() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cart = useAppSelector(state => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress || !cart.shippingAddress.address) {
      navigate("/shipping");
    }
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress?.address, navigate]);

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

  if (error) {
    return (
      <>
        <pre>{JSON.stringify(error, null, 2)}</pre>
        toast.error(err);
      </>
    );
  }

  return (
    <Fragment>
      <h2 className="text-sm italic text-center my-8">Order Summary</h2>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="grid grid-cols-2 mt-8">
        <div className="space-y-4">
          <h2 className="text-sm italic text-center">Shipping</h2>
          <div>
            <p className="ml-2 italic text-sm">{cart.shippingAddress?.address}</p>
            <p className="ml-2 italic text-sm">{cart.shippingAddress?.city}</p>
            <p className="ml-2 italic text-sm">{cart.shippingAddress?.postalCode}</p>
          </div>
          <div>
            <p className="text-sm italic font-semibold">Payment Method: </p>
            <p className="ml-2 italic text-sm">{cart.paymentMethod}</p>
          </div>
          <div>
            <p className="text-sm italic font-semibold">Total</p>
            <p className="italic text-sm">${cart.totalAmount}</p>
          </div>
        </div>
        <div>
          <h2 className="text-sm italic mb-4 text-center">Order Items</h2>
          {cart.products.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div className="overflow-y-auto max-h-96 space-y-4 rounded-sm flex flex-col items-center">
              {cart.products.map(({ product, quantity }, idx) => (
                <div key={idx}>
                  <div className="object-contain">
                    <img src={product.image} alt={product.name} className="h-52 rounded-lg" />
                  </div>
                  <div>
                    <Link
                      to={`/product/${product._id}`}
                      className="underline my-1 italic text-sm w-full"
                    >
                      {product.name}
                    </Link>
                  </div>
                  <Badge className="text-xs" variant="secondary">
                    {quantity} x ${product.price} = ${(quantity * (product.price * 100)) / 100}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Button
        disabled={cart.products.length === 0}
        onClick={placeOrderHandler}
        className="mt-16 w-full"
      >
        Place Order
      </Button>
      {isLoading && <Loader />}
    </Fragment>
  );
}

export default PlaceOrder;
