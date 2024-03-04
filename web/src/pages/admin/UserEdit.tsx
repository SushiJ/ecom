import { Fragment } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../features/user/slice";

import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";

const UserEdit = () => {
  const { id: userId } = useParams() as { id: string };

  const navigate = useNavigate();

  const { data, isLoading, refetch, error } = useGetUserDetailsQuery(userId);

  const initialState = {
    name: data ? data.name : "",
    email: data ? data.email : "",
    isAdmin: data ? data.isAdmin : false,
    userId,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeof initialState>({
    values: initialState,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const onSubmit = async (values: typeof initialState) => {
    try {
      await updateUser({
        name: values.name,
        email: values.email,
        isAdmin: values.isAdmin,
        id: userId,
      }).unwrap();
      toast.success("Updated successfully");
      refetch();
      navigate("/admin/users");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("ERROR:::", error);
      toast(error.data.error, {
        type: "error",
      });
    }
  };

  return (
    <>
      <Link to="/admin/users" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <Fragment>
          <h1>Edit User</h1>
          {loadingUpdate && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Alert variant="danger">{JSON.stringify(error, null, 2)}</Alert>
          ) : (
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
                  <Form.Label>Email</Form.Label>
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

                <Form.Group className="my-2" controlId="isAdmin">
                  <Form.Label>Is admin</Form.Label>
                  <Form.Check
                    className="my-2"
                    type="radio"
                    label="False"
                    id="false"
                    value="false"
                    {...register("isAdmin", {
                      required: "isAdmin is required",
                    })}
                  />
                  <Form.Check
                    className="my-2"
                    type="radio"
                    label="True"
                    id="true"
                    value="true"
                    {...register("isAdmin", {
                      required: "isAdmin is required",
                    })}
                  />
                  {errors.isAdmin && (
                    <Form.Text className="text-danger">
                      {errors.isAdmin.message}
                    </Form.Text>
                  )}
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  style={{ marginTop: "1rem" }}
                >
                  Update
                </Button>
              </fieldset>
            </Form>
          )}
        </Fragment>
      </FormContainer>
    </>
  );
};

export default UserEdit;
