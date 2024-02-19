import { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useProfileMutation } from "../features/user/slice";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [updateProfile, { isLoading }] = useProfileMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo || !userInfo.name) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const initialState = {
    name: userInfo.name ? userInfo.name : "",
    email: userInfo.email ? userInfo.email : "",
    password: "",
    confirmPassword: "",
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    setFocus,
  } = useForm<typeof initialState>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit = async (values: typeof initialState) => {
    if (values.password !== values.confirmPassword) {
      setError("confirmPassword", {
        message: "Password do not match",
        type: "onBlur",
      });
      return;
    }
    try {
      await updateProfile({
        name: values.name,
        email: values.email,
        password: values.password,
      }).unwrap();
      toast.success("Updated successfully");
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
        <h1>Sign up</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className={isLoading ? "opacity-50" : "opacity-100"}>
            <Form.Group className="my-2" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name..."
                {...register("name", { required: "Name is required" })}
              ></Form.Control>
              {errors.name && (
                <Form.Text className="text-danger">
                  {errors.name.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email..."
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
                placeholder="Enter password..."
                {...register("password", { required: "password is required" })}
              ></Form.Control>
              {errors.password && (
                <Form.Text className="text-danger">
                  {errors.password.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="my-2" controlId="confirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password..."
                {...register("confirmPassword", {
                  required: "password is required",
                })}
              ></Form.Control>
              {errors.confirmPassword && (
                <Form.Text className="text-danger">
                  {errors.confirmPassword.message}
                </Form.Text>
              )}
            </Form.Group>

            <Button disabled={isLoading} type="submit" variant="primary">
              Sign up
            </Button>
          </fieldset>
          {isLoading && <Loader />}
        </Form>
        <Row className="py-3">
          <Col>
            Already have an account?
            <Link to="/login" className="ms-1">
              Sign in
            </Link>
          </Col>
        </Row>
      </Fragment>
    </FormContainer>
  );
};

export default Profile;
