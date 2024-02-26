import { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";

import { useAppSelector } from "../hooks/redux";
import { useProfileMutation } from "../features/user/slice";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useGetMyOrdersQuery } from "../features/orders/slice";

const Profile = () => {
  const navigate = useNavigate();

  const { userInfo } = useAppSelector((state) => state.auth);

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingProfile }] = useProfileMutation();

  useEffect(() => {
    if (!userInfo || !userInfo.name) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const initialState = {
    name: userInfo.name,
    email: userInfo.email,
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
    defaultValues: initialState,
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
    <Fragment>
      <FormContainer>
        <Fragment>
          <h2>User Profile</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* TODO: may be address form side to side? */}
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
                  {...register("password", {
                    required: "password is required",
                  })}
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

              <Button
                disabled={isLoading}
                type="submit"
                variant="primary"
                className="mt-2"
              >
                Save
              </Button>
            </fieldset>
            {isLoading && <Loader />}
          </Form>
        </Fragment>
      </FormContainer>
      {loadingProfile && <Loader />}
      <h2 className="mt-5">My Orders</h2>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Alert variant="danger">{JSON.stringify(error, null, 2)}</Alert>
      ) : orders && orders.length > 0 ? (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalAmount}</td>
                <td>
                  {order.isPaid ? (
                    new Date(order.paidAt!).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  ) : (
                    <Icon icon="solar:bill-cross-bold" width="22" height="22" />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    new Date(order.deliveredAt!).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  ) : (
                    <Icon
                      icon="ic:baseline-do-not-disturb-alt"
                      width="22"
                      height="22"
                    />
                  )}
                </td>
                <td>
                  <Link className="btn btn-primary" to={`/order/${order._id}`}>
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>None found</p>
      )}
    </Fragment>
  );
};

export default Profile;
