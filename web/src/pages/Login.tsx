import { Fragment, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useAppDispatch } from "../hooks/redux";
import { useAppSelector } from "../hooks/redux";
import { useLoginMutation } from "../features/user/slice";
import { setCredentials } from "../features/auth/slice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { z } from "zod";
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
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z
      .string({
        message: "Password is required",
      })
      .min(6, {
        message: "Password must be at least 6 characters",
      }),
  })
  .required({
    email: true,
    password: true,
  });

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    form.setFocus("email");
  }, [form.setFocus]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      dispatch(setCredentials(res));
      navigate(redirect);
      toast.success("Logged in successfully");
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
      <Form {...form}>
        <h1>Login</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-56 flex items-center justify-center mx-auto"
        >
          <fieldset className={isLoading ? "opacity-50" : "opacity-100"}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email..." {...field} type="email" />
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
                    <Input
                      placeholder="Password..."
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoading} type="submit" variant="outline">
              Sign In
            </Button>
          </fieldset>
        </form>
        {isLoading && <Loader />}
      </Form>
      <div className="flex justify-center">
        New Customer?
        <Link
          to={redirect ? `/register?redirect=${redirect}` : "/register"}
          className="ms-1 underline"
        >
          Sign up
        </Link>
      </div>
    </Fragment>
  );
};

export default Login;
