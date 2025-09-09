import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import { useAppDispatch } from "../hooks/redux";
import { useAppSelector } from "../hooks/redux";
import { saveShippingAddress } from "../features/cart/slice";

import { Input } from "@/components/ui/input";
import FormContainer from "@/components/FormContainer";
import CheckoutSteps from "@/components/CheckoutSteps";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
	address: z.string({ message: "Address is required" }),
	city: z.string({
		message: "City is required",
	}),
	postalCode: z.string({
		message: "Postal code is required",
	}),
});

const Shipping = () => {
	const navigate = useNavigate();
	const { shippingAddress } = useAppSelector((state) => state.cart);
	const dispatch = useAppDispatch();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			address: "",
			city: "",
			postalCode: "",
		},
	});

	useEffect(() => {
		form.setFocus("address");
	}, [form.setFocus]);

	useEffect(() => {
		if (shippingAddress && shippingAddress.address) {
			form.reset({ ...shippingAddress });
		}
	}, []);

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		dispatch(saveShippingAddress({ ...values }));
		navigate("/payment");
	};

	return (
		<>
			<h1 className="my-8 text-sm italic text-center">Shipping</h1>
			<CheckoutSteps step1 step2 />
			<FormContainer>
				<Fragment>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<fieldset className="space-y-4 my-8">
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Address</FormLabel>
											<FormControl>
												<Input placeholder="Street Address" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="city"
									render={({ field }) => (
										<FormItem>
											<FormLabel>City</FormLabel>
											<FormControl>
												<Input placeholder="City" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="postalCode"
									render={({ field }) => (
										<FormItem>
											<FormLabel>City</FormLabel>
											<FormControl>
												<Input placeholder="Postal Code" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type="submit">Next</Button>
							</fieldset>
						</form>
					</Form>
				</Fragment>
			</FormContainer>
		</>
	);
};

export default Shipping;
