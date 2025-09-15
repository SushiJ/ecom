import { type FastifyInstance } from "fastify";
import Product from "../controllers/products";
import { isAdmin, protect } from "../utils/auth";
import { mongoDBIdSchema } from "../schemas/userSchema";

async function productRoutes(fastify: FastifyInstance) {
	const product = new Product();
	fastify.get("/", product.getProducts);
	fastify.post("/", { onRequest: [protect, isAdmin] }, product.createProducts);

	fastify.get(
		"/:id",
		{
			schema: {
				params: mongoDBIdSchema,
			},
		},
		product.getProductsById,
	);
	fastify.put(
		"/:id",
		{
			schema: {
				params: mongoDBIdSchema,
			},
			onRequest: [protect, isAdmin],
		},
		product.updateProduct,
	);
	fastify.delete(
		"/:id",
		{
			schema: {
				params: mongoDBIdSchema,
			},
			onRequest: [protect, isAdmin],
		},
		product.deleteProduct,
	);

	fastify.get("/top", product.getTopProducts);

	fastify.post(
		"/reviews/:id",
		{
			schema: {
				params: mongoDBIdSchema,
			},
			onRequest: [protect],
		},
		product.createProductReview,
	);

	fastify.log.info("Products routes registered");
}

export default productRoutes;
