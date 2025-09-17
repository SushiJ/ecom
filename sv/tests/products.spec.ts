import supertest from "supertest";
import { build } from "../src/index";
import { FastifyBaseLogger, FastifyInstance } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { Database } from "../utils/testing";
import { productModel } from "../src/models/Product";

let app: FastifyInstance<
	Server<typeof IncomingMessage, typeof ServerResponse>,
	IncomingMessage,
	ServerResponse<IncomingMessage>,
	FastifyBaseLogger,
	ZodTypeProvider
>;

let request: ReturnType<typeof supertest>;
let database: Database;

beforeAll(async () => {
	database = new Database();
	await database.connectToDatabase();

	app = build();

	await app.ready();
	request = supertest(app.server);
});

afterEach(async () => {
	await database.dropDatabase("PRODUCTS");
});

afterAll(async () => {
	await database.disconnect();
	await app.close();
});

it("GET /products should return empty list", async () => {
	const res = await request.get("/products");
	expect(res.status).toBe(200);
	expect(res.body.products).toEqual([]);
});
it("GET /products should have list of products, have key page & pages", async () => {
	await database.insertProducts();
	const res = await request.get("/products");
	expect(res.status).toBe(200);
	expect(res.body).toHaveProperty("page");
	expect(res.body).toHaveProperty("pages");
	expect(res.body).toHaveProperty("products");
});
it("GET /products?keyword should have list/single product(s), have key page & pages", async () => {
	await database.insertProducts();
	let keyword = "iphone";
	const res = await request.get(`/products?${keyword}`);
	expect(res.status).toBe(200);
	expect(res.body).toHaveProperty("page");
	expect(res.body).toHaveProperty("pages");
	expect(res.body).toHaveProperty("products");
});

it("GET /products/:id should return 400 when id is not mongo id", async () => {
	const res = await request.get("/products/1");
	expect(res.status).toBe(400);
	expect(res.body).toHaveProperty(["message"]);
});
it("GET /products/:id should return 404 when id doesn't match any product", async () => {
	const id = "68c17ccb1d2f253878dcc405";
	const res = await request.get(`/products/${id}`);
	expect(res.status).toBe(404);
	expect(res.body).toHaveProperty(["message"]);
});
it("GET /product/:id should return product associated with the id and it is present", async () => {
	let product = {
		name: "Airpods Wireless Bluetooth Headphones",
		image: "/images/airpods.jpg",
		description:
			"Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working",
		brand: "Apple",
		category: "Electronics",
		price: 89.99,
		countInStock: 10,
		rating: 4.5,
		numReviews: 12,
	};
	const savedProduct = await new productModel(product).save();

	const res = await request.get(`/products/${savedProduct._id}`);
	expect(res.status).toBe(200);
	expect(res.body.name).toMatch(savedProduct.name);
});

test("GET /top should return top products", async () => {
	await database.insertProducts();
	const res = await request.get("/products/top");
	expect(res.status).toBe(200);
	expect(res.body.length).toBeGreaterThan(0);
});

// fastify.post(
// 	"/",
// 	{
// 		onRequest: [protect, isAdmin],
// 	},
// 	product.createProducts,
// );
//
//
// fastify.put(
// 	"/:id",
// 	{
// 		schema: {
// 			params: mongoDBIdSchema,
// 		},
// 		onRequest: [protect, isAdmin],
// 	},
// 	product.updateProduct,
// );
// fastify.delete(
// 	"/:id",
// 	{
// 		schema: {
// 			params: mongoDBIdSchema,
// 		},
// 		onRequest: [protect, isAdmin],
// 	},
// 	product.deleteProduct,
// );
//
// fastify.post(
// 	"/reviews/:id",
// 	{
// 		schema: {
// 			params: mongoDBIdSchema,
// 		},
// 		onRequest: [protect],
// 	},
// 	product.createProductReview,
// );
//
