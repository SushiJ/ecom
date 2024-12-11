import { Link } from "react-router-dom";

import { useGetOrdersQuery } from "../../features/orders/slice";

import { Badge } from "@/components/ui/badge";
import Loader from "@/components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  if (!orders || orders.length === 0) {
    return (
      <>
        <h1 className="text-sm italic text-center my-8">Orders</h1>
        <p className="text-xs italic text-center">No orders</p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-sm italic text-center my-8">Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <pre>{JSON.stringify(error, null, 2)}</pre>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>USER</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.user._id && order.user.name}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleString("en-IN", {})}
                </TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>
                  {order.isPaid ? (
                    <Badge variant="secondary">
                      {new Date(order.paidAt!).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs italic">
                      Not Paid
                    </Badge>
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
                    <Badge variant="outline" className="text-xs italic">
                      Not delivered
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Link to={`/order/${order._id}`}>Details</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default OrderList;
