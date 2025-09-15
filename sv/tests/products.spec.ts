import supertest from "supertest";
import { build } from "../src/index";
import { FastifyBaseLogger, FastifyInstance } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { connectTestDb } from "../utils/testing";
import mongoose from "mongoose";

let app: FastifyInstance<
	Server<typeof IncomingMessage, typeof ServerResponse>,
	IncomingMessage,
	ServerResponse<IncomingMessage>,
	FastifyBaseLogger,
	ZodTypeProvider
>;

let request: any;
let connection: typeof mongoose;

// fastify.get("/", product.getProducts);
// fastify.post("/", { onRequest: [protect, isAdmin] }, product.createProducts);
//
// fastify.get("/:id", product.getProductsById);
// fastify.put("/:id", { onRequest: [protect, isAdmin] }, product.updateProduct);
// fastify.delete(
// 	"/:id",
// 	{ onRequest: [protect, isAdmin] },
// 	product.deleteProduct,
// );
//
// fastify.get("/top", product.getTopProducts);
//
// fastify.post(
// 	"/reviews/:id",
// 	{ onRequest: [protect] },
// 	product.createProductReview,
// );

beforeAll(async () => {
	connection = await connectTestDb();

	app = build();

	await app.ready();
	request = supertest(app.server);
});

afterAll(async () => {
	await connection.disconnect();
	await app.close();
});

test("GET /products should return empty list", async () => {
	const res = await request.get("/products");
	expect(res.status).toBe(200);
	expect(res.body.products).toEqual([]);
});

test("GET /products/:id should return 400 when id is not mongo id", async () => {
	const res = await request.get("/products/1");
	expect(res.status).toBe(400);
	expect(res.body).toHaveProperty(["message"]);
});

test("GET /products/:id should return 404 when id doesn't match any product", async () => {
	const id = "68c17ccb1d2f253878dcc405";
	const res = await request.get(`/products/${id}`);
	expect(res.status).toBe(404);
	expect(res.body).toHaveProperty(["message"]);
});
