import { type FastifyInstance } from "fastify";
import Product from "../controllers/products";
import { isAdmin, protect } from "../utils/auth";

async function productRoutes(fastify: FastifyInstance) {
  const product = new Product();
  fastify
    .get("/", product.getProducts)
    .post("/", { onRequest: [protect, isAdmin] }, product.createProducts);

  fastify
    .get("/:id", product.getProductsById)
    .put("/:id", { onRequest: [protect, isAdmin] }, product.updateProduct)
    .delete("/:id", { onRequest: [protect, isAdmin] }, product.deleteProduct);

  fastify.get("/top", product.getTopProducts);

  fastify.log.info("Products routes registered");
}

export default productRoutes;
