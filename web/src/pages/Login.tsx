import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Form, Button, Row, Col } from "react-bootstrap";

import { useAppDispatch } from "../hooks/redux";
import { useAppSelector } from "../hooks/redux";
import { useLoginMutation } from "../features/user/slice";
import { setCredentials } from "../features/auth/slice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  const { search } = useLocation();

  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const initialState = {
    email: "",
    password: "",
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [initialValues, _] = useState(initialState);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: initialValues,
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const onSubmit = async (values: typeof initialState) => {
    try {
      const res = await login({
        email: values.email,
        password: values.password,
      }).unwrap();
      dispatch(setCredentials(res));
      navigate(redirect);
      toast.success("Logged in successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("ERROR:::", error);
      toast(error.data.error, {
        type: "error",
      });
    }
  };

  return (
    <FormContainer>
      <Fragment>
        <h1>Login</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className={isLoading ? "opacity-50" : "opacity-100"}>
            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...register("email", { required: "Email is required" })}
              ></Form.Control>
              {errors.email && (
                <Form.Text className="text-danger">
                  {errors.email.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="my-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                {...register("password", { required: "password is required" })}
              ></Form.Control>
              {errors.password && (
                <Form.Text className="text-danger">
                  {errors.password.message}
                </Form.Text>
              )}
            </Form.Group>

            <Button disabled={isLoading} type="submit" variant="primary">
              Sign In
            </Button>
          </fieldset>
          {isLoading && <Loader />}
        </Form>
        <Row className="py-3">
          <Col>
            New Customer?
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="ms-1"
            >
              Sign up
            </Link>
          </Col>
        </Row>
      </Fragment>
    </FormContainer>
  );
};

export default Login;
