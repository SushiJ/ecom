import { type FastifyInstance } from "fastify";
import Product from "../controllers/products";

async function productRoutes(fastify: FastifyInstance) {
  fastify.get("/", Product.getProducts);
  // 6543e69b2cf3befc0f2c51a7
  fastify.get("/:id", Product.getProductsById);

  fastify.log.info("Products routes registered");
}

export default productRoutes;
