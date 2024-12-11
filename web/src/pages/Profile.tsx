import { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppSelector } from "../hooks/redux";
import { useProfileMutation } from "../features/user/slice";
import { useGetMyOrdersQuery } from "../features/orders/slice";

import FormContainer from "@/components/FormContainer";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const Profile = () => {
  const navigate = useNavigate();

  const { userInfo } = useAppSelector((state) => state.auth);

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingProfile }] = useProfileMutation();

  useEffect(() => {
    if (!userInfo || !userInfo.name) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    defaultValues: {
      name: userInfo.name,
      email: userInfo.email,
      confirm: "",
      password: "",
    },
  });

  useEffect(() => {
    form.setFocus("name");
  }, [form.setFocus]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateProfile({
        name: values.name,
        email: values.email,
        password: values.password,
      }).unwrap();
      toast.success("Updated successfully");
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
      <FormContainer>
        <Fragment>
          <h2 className="text-center italic text-sm mb-8">Profile</h2>
          <Form {...form}>
            {/*       {/* TODO: may be address form side to side? */}

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset
                className={clsx(
                  isLoading ? "opacity-50" : "opacity-100",
                  "space-y-4",
                )}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="John doe..." {...field} />
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
                        <Input placeholder="johndoe@email.com" {...field} />
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
                        <Input placeholder="******" {...field} />
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
                        <Input placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} type="submit" className="mt-2">
                  Save
                </Button>
              </fieldset>
              {isLoading && <Loader />}
            </form>
          </Form>
        </Fragment>
      </FormContainer>
      {loadingProfile && <Loader />}
      <h2 className="text-sm italic text-center">Orders</h2>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <pre>{JSON.stringify(error, null, 2)}</pre>
      ) : orders && orders.length > 0 ? (
        <Table>
          <TableCaption>A list of your recent orders</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.createdAt.substring(0, 10)}</TableCell>
                <TableCell>{order.totalAmount}</TableCell>
                <TableCell>
                  {order.isPaid ? (
                    new Date(order.paidAt!).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  ) : (
                    <Icon icon="solar:bill-cross-bold" width="22" height="22" />
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered ? (
                    new Date(order.deliveredAt!).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  ) : (
                    <Icon
                      icon="ic:baseline-do-not-disturb-alt"
                      width="22"
                      height="22"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Link className="btn btn-primary" to={`/order/${order._id}`}>
                    Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="mt-4 text-sm text-center">No orders yet.</p>
      )}
    </Fragment>
  );
};

export default Profile;
