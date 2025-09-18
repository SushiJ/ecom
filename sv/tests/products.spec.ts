import supertest from "supertest";
import { build } from "../src/index";
import { FastifyBaseLogger, FastifyInstance } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { Database } from "../utils/testing";

let app: FastifyInstance<
	Server<typeof IncomingMessage, typeof ServerResponse>,
	IncomingMessage,
	ServerResponse<IncomingMessage>,
	FastifyBaseLogger,
	ZodTypeProvider
>;

let request: ReturnType<typeof supertest>;
let database: Database;

function extractJwtFromSetCookie(setCookieHeader: any): string {
	const raw = setCookieHeader[0]; // grab first cookie
	return raw.split(";")[0].split("=")[1]; // get value after citrus=
}

beforeAll(async () => {
	database = new Database();
	await database.connectToDatabase();

	app = build();

	await app.ready();
	request = supertest(app.server);
});

afterEach(async () => {
	await database.dropDatabase("PRODUCTS");
	await database.dropDatabase("USERS");
});

afterAll(async () => {
	await database.disconnect();
	await app.close();
});

test("GET /products should return empty list", async () => {
	const res = await request.get("/products");
	expect(res.status).toBe(200);
	expect(res.body.products).toEqual([]);
});
test("GET /products should have list of products, have key page & pages", async () => {
	await database.setupProducts();
	const res = await request.get("/products");
	expect(res.status).toBe(200);
	expect(res.body).toHaveProperty("page");
	expect(res.body).toHaveProperty("pages");
	expect(res.body).toHaveProperty("products");
});
test("GET /products?keyword should have list/single product(s), have key page & pages", async () => {
	await database.setupProducts();
	let keyword = "iphone";
	const res = await request.get(`/products?${keyword}`);
	expect(res.status).toBe(200);
	expect(res.body).toHaveProperty("page");
	expect(res.body).toHaveProperty("pages");
	expect(res.body).toHaveProperty("products");
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
test("GET /product/:id should return product associated with the id and it is present", async () => {
	const savedProduct = await database.setupProduct();

	const res = await request.get(`/products/${savedProduct._id}`);
	expect(res.status).toBe(200);
	expect(res.body.name).toMatch(savedProduct.name);
});

test("GET /top should return top products", async () => {
	await database.setupProducts();
	const res = await request.get("/products/top");
	expect(res.status).toBe(200);
	expect(res.body.length).toBeGreaterThan(0);
});

test("DELETE /:id should error out when not authenticated", async () => {
	const savedProduct = await database.setupProduct();

	const res = await request.delete(`/products/${savedProduct._id}`);
	expect(res.status).toBe(401);
	expect(res.body).toHaveProperty("message");
});
test("DELETE /products/:id should error out when user.role is not admin", async () => {
	const savedProduct = await database.setupProduct();

	const password = "123456";
	const user = await database.setupUser("user");
	const userLoginRes = await request.post("/users/login").send({
		email: user.email,
		password,
	});

	const cookie = extractJwtFromSetCookie(userLoginRes.headers["set-cookie"]);

	const res = await request
		.delete(`/products/${savedProduct._id}`)
		.set("Cookie", [`citrus=${cookie}`]);

	expect(res.status).toBe(403);
	expect(res.body).toHaveProperty("message");
});
test("DELETE /products/:id should return 200 user.role is admin", async () => {
	const savedProduct = await database.setupProduct();

	const password = "123456";
	const user = await database.setupUser("admin");
	const adminUserRes = await request.post("/users/login").send({
		email: user.email,
		password,
	});

	expect(adminUserRes.status).toBe(200);
	expect(adminUserRes.headers["set-cookie"]).toBeDefined();

	const cookie = extractJwtFromSetCookie(adminUserRes.headers["set-cookie"]);

	const res = await request
		.delete(`/products/${savedProduct._id}`)
		.set("Cookie", [`citrus=${cookie}`]);

	expect(res.status).toBe(200);
});

// fastify.post(
// 	"/",
// 	{
// 		onRequest: protect,
// 		preHandler: isAdmin,
// 	},
// 	product.createProducts,
// );

// fastify.put(
// 	"/:id",
// 	{
// 		schema: {
// 			params: mongoDBIdSchema,
// 		},
// 		onRequest: protect,
// 		preHandler: isAdmin,
// 	},
// 	product.updateProduct,
// );

// fastify.post(
// 	"/reviews/:id",
// 	{
// 		schema: {
// 			params: mongoDBIdSchema,
// 		},
// 		onRequest: protect,
// 	},
// 	product.createProductReview,
// );
