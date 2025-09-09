import {
	GetAllOrdersResponse,
	GetOrdersResponse,
	OrderCreateResponse,
} from "../../types/order";
import { api } from "../api";

export const orderApiSlice = api.injectEndpoints({
	endpoints: (builder) => ({
		createOrder: builder.mutation({
			query: (order) => ({
				url: "orders",
				method: "POST",
				body: order,
			}),
		}),
		getOrderDetails: builder.query<OrderCreateResponse, string>({
			query: (id) => ({
				url: `orders/${id}`,
			}),
			keepUnusedDataFor: 5,
		}),
		payOrder: builder.mutation({
			query: ({ orderId, details }) => ({
				url: `orders/${orderId}/pay`,
				method: "PUT",
				body: details,
			}),
		}),
		getPaypalClientId: builder.query<
			{
				clientId: string;
			},
			void
		>({
			query: () => ({
				url: "api/config/paypal",
			}),
			keepUnusedDataFor: 5,
		}),
		getMyOrders: builder.query<Array<GetOrdersResponse>, void>({
			query: () => ({
				url: `orders/me`,
			}),
			keepUnusedDataFor: 5,
		}),
		getOrders: builder.query<Array<GetAllOrdersResponse>, void>({
			query: () => ({
				url: "orders",
			}),
			keepUnusedDataFor: 5,
		}),
		deliverOrder: builder.mutation({
			query: (orderId) => ({
				url: `orders/${orderId}/deliver`,
				method: "PUT",
			}),
		}),
	}),
});

export const {
	useCreateOrderMutation,
	useGetOrderDetailsQuery,
	usePayOrderMutation,
	useGetMyOrdersQuery,
	useGetOrdersQuery,
	useDeliverOrderMutation,
	useGetPaypalClientIdQuery,
} = orderApiSlice;
