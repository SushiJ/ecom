import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";

import {
  useGetProductsByIdQuery,
  useUpdateProductMutation,
  // useUploadProductImageMutation,
} from "../../features/products/slice";

import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDelay } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Product is required",
  }),
  price: z.number().min(1, {
    message: "Price is required",
  }),
  image: z.string().min(6, {
    message: "Image is required",
  }),
  brand: z.string().min(6, {
    message: "Brand is required",
  }),
  category: z.string().min(6, {
    message: "Category is required",
  }),
  countInStock: z.number().min(1, {
    message: "Count is required",
  }),
  description: z.string().min(6, {
    message: "Description is required",
  }),
  productId: z.string(),
});

const ProductEdit = () => {
  const { id: productId } = useParams() as { id: string };
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductsByIdQuery(productId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const delay = useDelay(500);

  //TODO: Implement skeleton
  useEffect(() => {
    form.reset({ ...product, productId });
  }, [isLoading]);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  // const [uploadProductImage, { isLoading: loadingUpload }] =
  //   useUploadProductImageMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      navigate("/admin/products");
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
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
  return (
    <>
      <Link
        to="/admin/products"
        className="my-4 text-xs bg-neutral-300 px-2 py-1 rounded"
      >
        Go Back
      </Link>
      <h1 className="text-sm italic text-center my-8">Edit</h1>
      <FormContainer>
        <Fragment>
          {loadingUpdate && <Loader />}
          {isLoading || delay ? (
            <Loader />
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* TODO: may be address form side to side? */}

                <fieldset
                  className={clsx(
                    loadingUpdate ? "opacity-50" : "opacity-100",
                    "space-y-2",
                  )}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Name..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="5.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/*           {/*  TODO: Image uploads*/}

                  {/*           {/* <Form.Control */}
                  {/*           {/*   onChange={uploadFileHandler} */}
                  {/*           {/*   aria-label="upload Image" */}
                  {/*           {/*   type="file" */}
                  {/*           {/* ></Form.Control> */}
                  {/*           {/* {loadingUpload && <Loader />} */}
                  {/*         </Form.Group> */}
                  <FormField
                    control={form.control}
                    name="countInStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Count in stock</FormLabel>
                        <FormControl>
                          <Input type="number" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            className="hidden"
                            value={productId}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" type="submit">
                    Update
                  </Button>
                </fieldset>
              </form>
            </Form>
          )}
        </Fragment>
      </FormContainer>
    </>
  );
};

export default ProductEdit;
