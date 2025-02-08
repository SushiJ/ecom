import { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { savePaymentMethod } from "../features/cart/slice";

import FormContainer from "@/components/FormContainer";
import CheckoutSteps from "@/components/CheckoutSteps";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";

const formSchema = z.object({
  payment_processor: z.enum(["razorpay", "paypal", "stripe"], {
    required_error: "Please select atmost 1 payment processor",
  }),
});

function Payments() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const shippingAddress = useAppSelector((state) => state.cart.shippingAddress);

  useEffect(() => {
    if (!shippingAddress || !shippingAddress.postalCode) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  // TODO: Add more payment methods (stripe cuz razorpay you need to give pan info just to test now)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    dispatch(savePaymentMethod(values.payment_processor));
    console.log(values.payment_processor);
    navigate("/placeorder");
  };

  return (
    <Fragment>
      <h1 className="my-8 italic text-sm text-center">Payment Method</h1>
      <CheckoutSteps step1 step2 step3 />
      <FormContainer>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="space-y-4 my-8 grid place-items-center items-center">
              <FormField
                control={form.control}
                name="payment_processor"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Payment</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="razorpay" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              RazorPay
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="paypal" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Paypal
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="stripe" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Stripe
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </fieldset>
          </form>
        </Form>
      </FormContainer>
    </Fragment>
  );
}

export default Payments;
