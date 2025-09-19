import supertest from "supertest";
import { FastifyBaseLogger, FastifyInstance } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { Database, extractJwtFromSetCookie } from "../utils/testing";
import { build } from "../src/index";

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
	await database.dropDatabase("USERS");
});

afterAll(async () => {
	await database.disconnect();
	await app.close();
});

// TODO: combine similar route tests!
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

test("POST /products should return 403 user.role is not admin", async () => {
	const password = "123456";
	const user = await database.setupUser("user");
	const userLoginRes = await request.post("/users/login").send({
		email: user.email,
		password,
	});

	expect(userLoginRes.status).toBe(200);
	expect(userLoginRes.headers["set-cookie"]).toBeDefined();

	const cookie = extractJwtFromSetCookie(userLoginRes.headers["set-cookie"]);

	const res = await request
		.post("/products")
		.set("Cookie", [`citrus=${cookie}`]);

	expect(res.status).toBe(403);
	expect(res.body.message).toBe("Not authorized");
});
test("POST /products should return 201 & the product that was just created when user.role is admin", async () => {
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
		.post("/products")
		.set("Cookie", [`citrus=${cookie}`]);

	expect(res.status).toBe(201);
	expect(res.body.name).toBe("Sample name");
});

// May be not test the auth middlewares here since I have already tested them with post routes
test("PUT /products/:id should return 400 when ID is not mongo db _id", async () => {
	const password = "123456";
	const user = await database.setupUser("admin");
	const adminUserRes = await request.post("/users/login").send({
		email: user.email,
		password,
	});

	expect(adminUserRes.status).toBe(200);
	expect(adminUserRes.headers["set-cookie"]).toBeDefined();

	const cookie = extractJwtFromSetCookie(adminUserRes.headers["set-cookie"]);

	let id = "1";
	const res = await request
		.put(`/products/${id}`)
		.set("Cookie", [`citrus=${cookie}`]);

	expect(res.status).toBe(400);
	expect(res.body).toHaveProperty("message");
});
test("PUT /products/:id should return 404 when ID doesn't match with any product", async () => {
	const password = "123456";
	const user = await database.setupUser("admin");
	const adminUserRes = await request.post("/users/login").send({
		email: user.email,
		password,
	});

	expect(adminUserRes.status).toBe(200);
	expect(adminUserRes.headers["set-cookie"]).toBeDefined();

	const cookie = extractJwtFromSetCookie(adminUserRes.headers["set-cookie"]);

	const id = "68c17ccb1d2f253878dcc405";
	const res = await request
		.put(`/products/${id}`)
		.set("Cookie", [`citrus=${cookie}`]);

	expect(res.status).toBe(404);
	expect(res.body).toHaveProperty("message");
});
test("PUT /products/:id should return 200 when product is successfully updated", async () => {
	const password = "123456";
	const user = await database.setupUser("admin");
	const adminUserRes = await request.post("/users/login").send({
		email: user.email,
		password,
	});

	expect(adminUserRes.status).toBe(200);
	expect(adminUserRes.headers["set-cookie"]).toBeDefined();

	const cookie = extractJwtFromSetCookie(adminUserRes.headers["set-cookie"]);

	const { body } = await request
		.post("/products")
		.set("Cookie", [`citrus=${cookie}`]);

	const res = await request
		.put(`/products/${body._id}`)
		.send({
			name: "Testing",
			price: 1337,
			description: "Testing the updation",
			image: "test",
			brand: "Tesvidia",
			category: "electronics",
			countInStock: 4,
		})
		.set("Cookie", [`citrus=${cookie}`]);

	expect(res.status).toBe(200);
	expect(res.body.name).toBe("Testing");
});
// Skipping the mongoDB _id check since it has already been tested different test using same schema
test("POST /products/reviews/:id should return 404 when id doesn't match anything", async () => {
	const password = "123456";
	const user = await database.setupUser("user");
	const userLoginRes = await request.post("/users/login").send({
		email: user.email,
		password,
	});

	expect(userLoginRes.status).toBe(200);
	expect(userLoginRes.headers["set-cookie"]).toBeDefined();

	const cookie = extractJwtFromSetCookie(userLoginRes.headers["set-cookie"]);

	const id = "68c17ccb1d2f253878dcc405";
	const res = await request
		.post(`/products/reviews/${id}`)
		.send({
			rating: 4,
			comment: "Testing 123",
		})
		.set("Cookie", [`citrus=${cookie}`]);

	expect(res.status).toBe(404);
	expect(res.body).toHaveProperty("message");
	expect(res.body.message).toBe("Product not found");
});
test("POST /products/reviews/:id should return 400 when body doesn't match", async () => {
	const password = "123456";
	const user = await database.setupUser("user");
	const userLoginRes = await request.post("/users/login").send({
		email: user.email,
		password,
	});

	expect(userLoginRes.status).toBe(200);
	expect(userLoginRes.headers["set-cookie"]).toBeDefined();

	const cookie = extractJwtFromSetCookie(userLoginRes.headers["set-cookie"]);

	const id = "68c17ccb1d2f253878dcc405";
	const res = await request
		.post(`/products/reviews/${id}`)
		.set("Cookie", [`citrus=${cookie}`]);

	expect(res.status).toBe(400);
	expect(res.body).toHaveProperty("message");
});
test("POST /products/reviews/:id should return 201 when success", async () => {
	const password = "123456";
	const user = await database.setupUser("user");
	const userLoginRes = await request.post("/users/login").send({
		email: user.email,
		password,
	});

	expect(userLoginRes.status).toBe(200);
	expect(userLoginRes.headers["set-cookie"]).toBeDefined();

	const cookie = extractJwtFromSetCookie(userLoginRes.headers["set-cookie"]);

	const product = await database.setupProduct();
	const res = await request
		.post(`/products/reviews/${product._id}`)
		.send({
			rating: 4,
			comment: "Testing 123",
		})
		.set("Cookie", [`citrus=${cookie}`]);

	expect(res.status).toBe(201);
	expect(res.body.name).toBe(product.name);
	expect(res.body.reviews.length).toBeGreaterThan(0);
});
test("POST /products/reviews/:id should return 400 when product has already been reviewed by the user", async () => {
	const password = "123456";
	const user = await database.setupUser("user");
	const userLoginRes = await request.post("/users/login").send({
		email: user.email,
		password,
	});

	expect(userLoginRes.status).toBe(200);
	expect(userLoginRes.headers["set-cookie"]).toBeDefined();

	const cookie = extractJwtFromSetCookie(userLoginRes.headers["set-cookie"]);

	const product = await database.setupProduct();
	const res = await request
		.post(`/products/reviews/${product._id}`)
		.send({
			rating: 4,
			comment: "Testing 123",
		})
		.set("Cookie", [`citrus=${cookie}`]);

	expect(res.status).toBe(201);
	expect(res.body.name).toBe(product.name);
	expect(res.body.reviews.length).toBeGreaterThan(0);

	const secondRes = await request
		.post(`/products/reviews/${product._id}`)
		.send({
			rating: 4,
			comment: "Testing 123",
		})
		.set("Cookie", [`citrus=${cookie}`]);

	expect(secondRes.status).toBe(400);
	expect(secondRes.body).toHaveProperty("message");
	expect(secondRes.body.message).toBe("Already reviewed");
});
