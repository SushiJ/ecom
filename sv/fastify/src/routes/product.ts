import { type FastifyInstance } from "fastify";
import Product from "../controllers/products";

const product = new Product();
async function productRoutes(fastify: FastifyInstance) {
  fastify.get("/", product.getProducts);
  // 6543e69b2cf3befc0f2c51a7
  fastify.get("/:id", product.getProductsById);

  fastify.log.info("Products routes registered");
}

export default productRoutes;
