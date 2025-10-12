import { Link } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { removeFromCart } from "../features/cart/slice";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import truncate from "@/lib/truncate";

import { GoBack } from "@/components/ui/goback";
import { Title } from "@/components/Title";

export default function CartPage() {
  const { products, totalAmount } = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();

  if (products.length === 0) {
    return (
      <div>
        <GoBack to="/" />
        <Title title="Your cart" />
        <p className="italic text-center text-neutral-500">Cart is empty </p>
      </div>
    );
  }

  return (
    <>
      <div>
        <GoBack to="/" />
        <Title title="Cart" />
        <div className="space-y-8">
          {products.map(({ product, quantity }) => (
            <div className="grid md:grid-cols-2 lg:grid-cols-3" key={product._id}>
              <div className="lg:col-span-1 object-contain md:mr-4 grid place-items-center mx-auto">
                <img
                  src={product.image}
                  alt={product.name}
                  className="xs:max-h-60 xs:max-w-60 mx-auto rounded my-2 md:my-0"
                />
              </div>
              <div className="lg:col-span-2 relative">
                <Card key={product._id} className="p-4">
                  <Link to={`/products/${product._id}`}>{product.name}</Link>
                  <div className="space-y-2">
                    <p>${product.price}</p>
                    <p className="text-xs">{product.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-10">
                    <p className="text-sm">Quantity: {quantity}</p>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => dispatch(removeFromCart(product._id))}
                    >
                      Remove item
                    </Button>
                  </div>
                </Card>
              </div>
              {/* TODO: add form here for updating quantity later */}

              {/*   <Form {...form}> */}
              {/*     <form */}
              {/*       onSubmit={form.handleSubmit(onSubmit)} */}
              {/*       className="flex flex-col space-y-8" */}
              {/*     > */}
              {/*       <FormField */}
              {/*         control={form.control} */}
              {/*         name="qty" */}
              {/*         render={({ field }) => ( */}
              {/*           <FormItem className="flex space-y-0 items-center space-x-2 mb-5"> */}
              {/*             <FormLabel>Quantity:</FormLabel> */}
              {/*             <FormControl> */}
              {/*               <Select */}
              {/*                 onValueChange={field.onChange} */}
              {/*                 defaultValue={quantity.toString()} */}
              {/*               > */}
              {/*                 <FormControl> */}
              {/*                   <SelectTrigger> */}
              {/*                     <SelectValue placeholder="Select quantity" /> */}
              {/*                   </SelectTrigger> */}
              {/*                 </FormControl> */}
              {/*                 <SelectContent> */}
              {/*                   {Array.from( */}
              {/*                     Array(product.countInStock).keys(), */}
              {/*                     (v) => { */}
              {/*                       return ( */}
              {/*                         <SelectItem value={`${v + 1}`} key={v}> */}
              {/*                           {v + 1} */}
              {/*                         </SelectItem> */}
              {/*                       ); */}
              {/*                     }, */}
              {/*                   )} */}
              {/*                 </SelectContent> */}
              {/*               </Select> */}
              {/*             </FormControl> */}
              {/*             <FormMessage /> */}
              {/*           </FormItem> */}
              {/*         )} */}
              {/*       /> */}
              {/*     </form> */}
              {/*   </Form> */}
              {/* </div> */}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <div className="text-right">
          <p>Subtotal ({products.length} items):</p>
          <p>$ {totalAmount?.toFixed(2)}</p>
        </div>
        <Button className="mt-4 mx-auto">
          <Link to="/shipping" className="w-96">
            Proceed to Checkout
          </Link>
        </Button>
      </div>
    </>
  );
}
