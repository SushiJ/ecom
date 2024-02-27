import { Link } from "react-router-dom";
import { Table, Alert, Badge } from "react-bootstrap";

import { useGetOrdersQuery } from "../../features/orders/slice";

import Loader from "../../components/Loader";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  if (!orders) {
    return <p>No orders</p>;
  }

  console.log(orders);
  return (
    <>
      <p>Admin Route</p>
      <h1>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Alert variant="danger">{JSON.stringify(error, null, 2)}</Alert>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user._id && order.user.name}</td>
                <td>{new Date(order.createdAt).toLocaleString("en-IN", {})}</td>
                <td>${order.totalAmount}</td>
                <td>
                  {order.isPaid ? (
                    <Badge bg="success" style={{ padding: "0.5rem" }}>
                      {new Date(order.paidAt!).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Badge>
                  ) : (
                    <Badge bg="danger">Not Paid</Badge>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    new Date(order.deliveredAt!).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  ) : (
                    <Badge bg="danger">Not Delivered</Badge>
                  )}
                </td>
                <td>
                  <Link
                    to={`/order/${order._id}`}
                    className="btn btn-sm btn-primary"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderList;
