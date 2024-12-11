import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppDispatch } from "../hooks/redux";

import { useGetProductsByIdQuery } from "../features/products/slice";
import { addToCart } from "../features/cart/slice";

import { Rating } from "@/components/Rating";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  qty: z.string().default("1"),
});

export default function Product() {
  const dispatch = useAppDispatch();
  const { id } = useParams() as { id: string };
  const { data, isError, isLoading } = useGetProductsByIdQuery(id);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      qty: "1",
    },
  });

  // TODO: Spinner component
  if (isLoading) <p>Loading...</p>;

  if (isError && !isLoading) {
    return (
      <>
        <Link className="my-3 btn btn-outline-primary" to="/">
          Go Back
        </Link>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Link className="my-3 btn btn-outline-primary" to="/">
          Go Back
        </Link>
        <p>Something went wrong</p>
      </>
    );
  }

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const quantity = +values.qty;
    if (!data) return;
    dispatch(addToCart({ data, quantity }));
  }

  return (
    <div className="min-h-full py-4">
      <Link className="my-3 btn btn-outline-primary" to="/">
        <span className="mr-2 no-underline">&lt;</span>
        <span className="underline">Go Back</span>
      </Link>
      {/* <Reviews */}
      {/*   isLoading={isLoading} */}
      {/*   id={id} */}
      {/*   reviews={data.reviews} */}
      {/*   refetch={refetch} */}
      {/* /> */}
      <div className="sm:flex items-center justify-center h-full py-12">
        <div className="object-contain mx-auto max-w-3/4 pb-8 sm:pb-0">
          <img src={data.image} alt={data.name} />
        </div>
        <Card className="p-2 mx-auto">
          <p className="mb-2">{data.name}</p>
          <Rating value={data.rating} text={`${data.numReviews} reviews`} />
          <p className="pb-6">{data.description}</p>
          <div>
            <p>
              Price: <strong className="ml-2">${data.price}</strong>
            </p>
            <p>
              Status:
              <strong className="text-neutral-800 ml-2">
                {data.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </strong>
            </p>
            {data.countInStock > 0 && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="qty"
                    render={({ field }) => (
                      <FormItem className="flex space-y-0 items-center space-x-2 mb-5">
                        <FormLabel>Quantity:</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select quantity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from(
                                Array(data.countInStock).keys(),
                                (v) => {
                                  return (
                                    <SelectItem value={`${v + 1}`} key={v}>
                                      {v + 1}
                                    </SelectItem>
                                  );
                                },
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="btn btn-primary"
                    type="submit"
                    disabled={data.countInStock === 0}
                  >
                    Add to bag
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
// Array.from(data.countInStock)
// {data.countInStock}
