import { type FastifyInstance } from "fastify";
import { isAdmin, protect, protectedNoBody } from "../utils/auth";
import Order from "../controllers/order";
import {
	AddOrderItemsRequestBody,
	AddOrderItemsSchema,
	PaymentUpdateRequest,
	PaymentUpdateSchema,
} from "../schemas/orderSchema";

async function orderRoutes(fastify: FastifyInstance) {
	const order = new Order();
	fastify.post<{
		Body: AddOrderItemsRequestBody;
	}>(
		"/",
		{ onRequest: protectedNoBody, schema: AddOrderItemsSchema },
		order.addOrderItems,
	);
	fastify.get("/", { onRequest: [protect, isAdmin] }, order.getOrders);

	fastify.get("/me", { onRequest: protect }, order.getMyOrders);

	fastify.get<{
		Params: {
			id: string;
		};
	}>("/:id", { onRequest: protectedNoBody }, order.getOrderById);

	fastify.put<PaymentUpdateRequest>(
		"/:id/pay",
		{
			onRequest: protectedNoBody,
			schema: PaymentUpdateSchema,
		},
		order.updateOrderToPaid,
	);

	fastify.put(
		"/:id/deliver",
		{ onRequest: [protect, isAdmin] },
		order.updateOrderToDelivered,
	);

	fastify.log.info("Order routes registered");
}

export default orderRoutes;
