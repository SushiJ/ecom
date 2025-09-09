import { Fragment, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

// import { useAppDispatch } from "../hooks/redux";
import { useAppSelector } from "../hooks/redux";
import { useRegisterMutation } from "../features/user/slice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z
	.object({
		name: z.string().min(1, {
			message: "name is required",
		}),
		email: z.string().email({
			message: "please enter a valid email address",
		}),
		password: z.string().min(6, {
			message: "password must be at least 6 characters",
		}),
		confirm: z.string().min(6, {
			message: "password must be at least 6 characters",
		}),
	})
	.refine((data) => data.password === data.confirm, {
		message: "passwords do not match",
		path: ["confirm"],
	});

const Register = () => {
	const navigate = useNavigate();

	const [registerMutation, { isLoading }] = useRegisterMutation();

	const { userInfo } = useAppSelector((state) => state.auth);

	const { search } = useLocation();

	const sp = new URLSearchParams(search);
	const redirect = sp.get("redirect") || "/";

	useEffect(() => {
		if (userInfo && userInfo.name) {
			navigate(redirect);
		}
	}, [navigate, redirect, userInfo]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		reValidateMode: "onChange",
		defaultValues: {
			name: "",
			email: "",
			confirm: "",
			password: "",
		},
	});

	useEffect(() => {
		form.setFocus("name");
	}, [form.setFocus]);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await registerMutation({
				name: values.name,
				email: values.email,
				password: values.password,
			}).unwrap();
			navigate("/login");
			toast.success("Registered successfully");
		} catch (error: any) {
			console.log("ERROR:::", error);
			toast(error.data.message, {
				type: "error",
			});
		}
	};

	return (
		<FormContainer>
			<Fragment>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<fieldset
							className={cn(
								"space-y-10",
								isLoading ? "opacity-50" : "opacity-100",
							)}
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="John doe" {...field} />
										</FormControl>
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
											<Input
												placeholder="johndoe@email.com"
												{...field}
												type="email"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input {...field} placeholder="******" type="password" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirm"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm password</FormLabel>
										<FormControl>
											<Input {...field} placeholder="******" type="password" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								disabled={isLoading}
								type="submit"
								onClick={() => console.log("clicked")}
								className="w-full"
							>
								Sign up
							</Button>
						</fieldset>
						{isLoading && <Loader />}
					</form>
				</Form>
				<div className="text-center mt-4">
					Already have an account?
					<Link to="/login" className="ms-1 underline">
						Sign in
					</Link>
				</div>
			</Fragment>
		</FormContainer>
	);
};

export default Register;
