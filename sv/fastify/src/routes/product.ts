import { type FastifyInstance } from "fastify";
import Product from "../controllers/products";

async function productRoutes(fastify: FastifyInstance) {
  const product = new Product();
  fastify.get("/", product.getProducts);
  // 6543e69b2cf3befc0f2c51a7
  fastify.get("/:id", product.getProductsById);

  fastify.log.info("Products routes registered");
}

export default productRoutes;
