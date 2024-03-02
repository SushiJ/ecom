import { Fragment } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import {
  useGetProductsByIdQuery,
  useUpdateProductMutation,
  // useUploadProductImageMutation,
} from "../../features/products/slice";

import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";

const ProductEdit = () => {
  const { id: productId } = useParams() as { id: string };
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductsByIdQuery(productId);

  // TODO: make this raective when the id changes
  const initialState = {
    name: product ? product.name : "",
    price: product ? product.price : 0,
    image: product ? product.image : "",
    brand: product ? product.brand : "",
    category: product ? product.category : "",
    countInStock: product ? product.countInStock : 0,
    description: product ? product.description : "",
    productId,
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

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  // const [uploadProductImage, { isLoading: loadingUpload }] =
  //   useUploadProductImageMutation();

  const onSubmit = async (values: typeof initialState) => {
    try {
      await updateProduct({
        id: values.productId,
        name: values.name,
        brand: values.brand,
        description: values.description,
        countInStock: values.countInStock,
        category: values.category,
        image: values.image,
        price: values.price,
      }).unwrap();
      toast.success("Updated successfully");
      refetch();
      navigate("/admin/productlist");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("ERROR:::", error);
      toast(error.data.error, {
        type: "error",
      });
    }
  };

  // const uploadFileHandler = async (e) => {
  //   const formData = new FormData();
  //   formData.append("image", e.target.files[0]);
  //   try {
  //     const res = await uploadProductImage(formData).unwrap();
  //     toast.success(res.message);
  //     setImage(res.image);
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (err: any) {
  //     toast.error(err);
  //   }
  // };

  return (
    <>
      <Link to="/admin/products" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <Fragment>
          <h1>Edit Product</h1>
          {loadingUpdate && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Alert variant="danger">{JSON.stringify(error, null, 2)}</Alert>
          ) : (
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

                <Form.Group controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    {...register("price", { required: "Price is required" })}
                  ></Form.Control>
                  {errors.price && (
                    <Form.Text className="text-danger">
                      {errors.price.message}
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group controlId="image">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter image url"
                    {...register("image", { required: "Image is required" })}
                  ></Form.Control>
                  {errors.image && (
                    <Form.Text className="text-danger">
                      {errors.image.message}
                    </Form.Text>
                  )}
                  {/*  TODO: Image uploads*/}

                  {/* <Form.Control */}
                  {/*   onChange={uploadFileHandler} */}
                  {/*   aria-label="upload Image" */}
                  {/*   type="file" */}
                  {/* ></Form.Control> */}
                  {/* {loadingUpload && <Loader />} */}
                </Form.Group>

                <Form.Group controlId="brand">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter brand"
                    {...register("brand", { required: "Brand is required" })}
                  ></Form.Control>
                  {errors.brand && (
                    <Form.Text className="text-danger">
                      {errors.brand.message}
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group controlId="countInStock">
                  <Form.Label>Count In Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter countInStock"
                    {...register("countInStock", {
                      required: "Count is required",
                    })}
                  ></Form.Control>
                  {errors.countInStock && (
                    <Form.Text className="text-danger">
                      {errors.countInStock.message}
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter category"
                    {...register("category", {
                      required: "Category is required",
                    })}
                  ></Form.Control>
                  {errors.category && (
                    <Form.Text className="text-danger">
                      {errors.category.message}
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  ></Form.Control>
                  {errors.description && (
                    <Form.Text className="text-danger">
                      {errors.description.message}
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

export default ProductEdit;
