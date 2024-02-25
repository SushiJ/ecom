import { type FastifyInstance } from "fastify";
import { isAdmin, protect } from "../utils/auth";
import Order from "../controllers/order";

async function orderRoutes(fastify: FastifyInstance) {
  const order = new Order();
  //TODO: Add schema validation
  fastify
    .post("/", { onRequest: protect }, order.addOrderItems)
    .get("/", { onRequest: [protect, isAdmin] }, order.getOrders);

  fastify.get("/me", { onRequest: protect }, order.getMyOrders);

  fastify.get("/:id", { onRequest: protect }, order.getOrderById);

  fastify.put("/:id/pay", { onRequest: protect }, order.updateOrderToPaid);

  fastify.delete(
    "/:id/deliver",
    { onRequest: [protect, isAdmin] },
    order.updateOrderToDelivered,
  );

  fastify.log.info("Order routes registered");
}

export default orderRoutes;
