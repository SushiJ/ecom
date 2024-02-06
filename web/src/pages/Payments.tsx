import { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Col, Form } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../features/cart/slice";

function Payments() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const shippingAddress = useAppSelector((state) => state.cart.shippingAddress);

  useEffect(() => {
    if (!shippingAddress || !shippingAddress.postalCode) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  // TODO: Add more payment methods
  enum PaymentEnum {
    PAYPAL = "paypal",
    RAZORPAY = "razorpay",
  }

  type FormValues = {
    paymentMethod: PaymentEnum;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = (values: FormValues) => {
    dispatch(savePaymentMethod(values.paymentMethod));
    console.log(values.paymentMethod);
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <Fragment>
        <CheckoutSteps step1 step2 step3 />
        <h1>Payment Method</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="payment-radio-inputs">
            <Form.Label as="legend">Select Method</Form.Label>
            <Col>
              <Form.Check
                className="my-2"
                type="radio"
                label="PayPal or Credit Card"
                id="PayPal"
                value={PaymentEnum.PAYPAL}
                {...register("paymentMethod", {
                  required: "Method is required",
                })}
              />
              <Form.Check
                className="my-2"
                type="radio"
                label="RazorPay"
                id="RazorPay"
                value={PaymentEnum.RAZORPAY}
                {...register("paymentMethod", {
                  required: "Method is required",
                })}
              />
              {errors.paymentMethod && (
                <Form.Text className="text-danger">
                  {errors.paymentMethod.message}
                </Form.Text>
              )}
            </Col>
          </Form.Group>

          <Button type="submit" variant="primary">
            Continue
          </Button>
        </Form>
      </Fragment>
    </FormContainer>
  );
}

export default Payments;
