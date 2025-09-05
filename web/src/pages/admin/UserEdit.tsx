import { Fragment, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn, useDelay } from "@/lib/utils";
import {
	useGetUserDetailsQuery,
	useUpdateUserMutation,
} from "../../features/user/slice";

import Loader from "@/components/Loader";
import FormContainer from "@/components/FormContainer";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoBack } from "@/components/ui/goback";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
	name: z.string(),
	email: z.string(),
	role: z.string({
		required_error: "You need to select true or false",
	}),
});

const UserEdit = () => {
	const { id: userId } = useParams() as { id: string };

	const navigate = useNavigate();

	const { data, isLoading, refetch, error } = useGetUserDetailsQuery(userId);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	useEffect(() => {
		if (!data) return;
		form.reset({ ...data.user, role });
	}, [isLoading]);

	const delay = useDelay(400);

	const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

	let role = data ? data.user.role : "user";

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await updateUser({
				name: values.name,
				email: values.email,
				role: values.role,
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
			<div className="mb-8">
				<GoBack to="/admin/users" />
				<h1 className="text-center text-sm italic">Edit</h1>
			</div>
			<FormContainer>
				<Fragment>
					{loadingUpdate && <Loader />}
					{isLoading || delay ? (
						<Loader />
					) : error ? (
						<pre>{JSON.stringify(error, null, 2)}</pre>
					) : (
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<fieldset
									className={cn(
										isLoading ? "opacity-50" : "opacity-100",
										"space-y-2",
									)}
								>
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input placeholder="John Doe..." {...field} />
												</FormControl>
												<FormDescription>
													This is your public display name.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input placeholder="johndoe@email.com" {...field} />
												</FormControl>
												<FormDescription>
													This is your public email.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="role"
										render={({ field }) => (
											<FormItem className="space-y-3">
												<FormLabel>Admin status</FormLabel>
												<FormControl>
													<RadioGroup
														onValueChange={field.onChange}
														defaultValue={role}
														className="flex flex-col space-y-1"
													>
														<FormItem className="flex items-center space-x-3 space-y-0">
															<FormControl>
																<RadioGroupItem value="admin" />
															</FormControl>
															<FormLabel className="font-normal">
																Admin
															</FormLabel>
														</FormItem>
														<FormItem className="flex items-center space-x-3 space-y-0">
															<FormControl>
																<RadioGroupItem value="user" />
															</FormControl>
															<FormLabel className="font-normal">
																User
															</FormLabel>
														</FormItem>
													</RadioGroup>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</fieldset>
								<Button
									type="submit"
									className="w-full mt-10"
									onClick={() => console.log("SUBMITTING")}
								>
									Update
								</Button>
							</form>
						</Form>
					)}
				</Fragment>
			</FormContainer>
		</>
	);
};

export default UserEdit;
