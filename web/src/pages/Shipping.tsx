import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../hooks/redux";
import { useAppSelector } from "../hooks/redux";
// import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { saveShippingAddress } from "../features/cart/slice";
import CheckoutSteps from "../components/CheckoutSteps";

const Shipping = () => {
  const navigate = useNavigate();

  const { shippingAddress } = useAppSelector((state) => state.cart);

  const dispatch = useAppDispatch();

  const initialState: typeof shippingAddress = shippingAddress;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [initialValues, _] = useState(initialState);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: initialValues,
  });

  useEffect(() => {
    setFocus("address");
  }, [setFocus]);

  const onSubmit = (values: typeof initialState) => {
    dispatch(saveShippingAddress({ ...values }));
    navigate("/payment");
  };

  return (
    <>
      <CheckoutSteps step1 step2 />
      <FormContainer>
        <Fragment>
          <h1>Shipping</h1>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="">
              <Form.Group className="my-2" controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  {...register("address", { required: "address is required" })}
                ></Form.Control>
                {errors.address && (
                  <Form.Text className="text-danger">
                    {errors.address.message}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group className="my-2" controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter city"
                  {...register("city", { required: "city is required" })}
                ></Form.Control>
                {errors.city && (
                  <Form.Text className="text-danger">
                    {errors.city.message}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="my-2" controlId="postalCode">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter postal code"
                  {...register("postalCode", { required: "Code is required" })}
                ></Form.Control>
                {errors.postalCode && (
                  <Form.Text className="text-danger">
                    {errors.postalCode.message}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="my-2" controlId="country">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter country"
                  {...register("country", { required: "Country is required" })}
                ></Form.Control>
                {errors.country && (
                  <Form.Text className="text-danger">
                    {errors.country.message}
                  </Form.Text>
                )}
              </Form.Group>
              <Button type="submit" variant="primary">
                Next
              </Button>
            </fieldset>
          </Form>
        </Fragment>
      </FormContainer>
    </>
  );
};

export default Shipping;
