import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Form, Button, Row, Col, Container } from "react-bootstrap";

import { useAppDispatch } from "../hooks/redux";
import { useAppSelector } from "../hooks/redux";
import { useLoginMutation } from "../features/user/slice";
import { setCredentials } from "../features/auth/slice";
import { toast } from "react-toastify";

const FormContainer = ({ children }: { children: JSX.Element }) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

const Login = () => {
  const initialState = {
    email: "",
    password: "",
  };

  // @typescript-eslint/no-unused-vars
  // eslint-disable-next-line
  const [initialValues, _] = useState(initialState);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    // reValidateMode: "onChange",
    defaultValues: initialValues,
  });

  const onSubmit = async (values: typeof initialState) => {
    console.log("Values:::", values);
    console.log("Values:::", JSON.stringify(values));
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
      toast(error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (error: any) => {
    console.log("ERROR:::", error);
    toast.error(error?.data?.message || error.error);
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  const { search } = useLocation();

  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  useEffect(() => {}, []);

  // useEffect(() => {
  //   if (userInfo) {
  //     navigate(redirect);
  //   }
  // }, [navigate, redirect, userInfo]);

  return (
    <FormContainer>
      <Fragment>
        <h1>Login</h1>
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
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
          {/* {isLoading && <Loader />} */}
        </Form>
        <Row className="py-3">
          <Col>
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              Register
            </Link>
          </Col>
        </Row>
      </Fragment>
    </FormContainer>
  );
};

export default Login;
