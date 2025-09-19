import supertest, { type Response } from "supertest";
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

beforeAll(async () => {
	database = new Database();
	await database.connectToDatabase();

	app = build();

	await app.ready();
	request = supertest(app.server);
});

afterEach(async () => {
	await database.dropDatabase("USERS");
	await database.dropDatabase("PRODUCTS");
});

afterAll(async () => {
	await database.disconnect();
	await app.close();
});

test("POST /users/login should be 400 when no data is provided", async () => {
	const res = await request.post("/users/login").send();

	expect(res.status).toBe(400);
	expect(res.body).toHaveProperty("message");
});
test("POST /users/login should be 401 when user email doesn't exist", async () => {
	const password = "123456";
	let email = "test@email.com";
	const res = await request.post("/users/login").send({
		email: email,
		password,
	});

	expect(res.status).toBe(401);
	expect(res.body).toHaveProperty("message");
	expect(res.body.message).toBe("Invalid credentials");
});
test("POST /users/login should be 401 when user password doesn't match or password length is under 6 characters", async () => {
	const password = "12345678";
	const user = await database.setupUser("user");
	let res: Response;
	res = await request.post("/users/login").send({
		email: user.email,
		password,
	});

	expect(res.status).toBe(401);
	expect(res.body).toHaveProperty("message");
	expect(res.body.message).toBe("Invalid credentials");

	res = await request.post("/users/login").send({
		email: user.email,
		password: "1234",
	});

	expect(res.status).toBe(400);
	expect(res.body).toHaveProperty("message");
});
test("POST /users/login should be 200 & header for cookie is properly set", async () => {
	const password = "123456";
	const user = await database.setupUser("user");
	const res = await request.post("/users/login").send({
		email: user.email,
		password,
	});

	expect(res.status).toBe(200);
	expect(res.headers["set-cookie"]).toBeTruthy();
	expect(res.body).toHaveProperty("message");
	expect(res.body.message).toBe("Login successfull");
	expect(res.body.user.name).toBe(user.name);
});

test("POST /users/register should be 201 when new user and 409 when user already exists", async () => {
	const user = {
		name: "test user",
		email: "test@email.com",
		password: "123456",
	};
	let res: Response;
	res = await request.post("/users").send({
		name: user.name,
		email: user.email,
		password: user.password,
	});

	expect(res.status).toBe(201);
	expect(res.body).toHaveProperty("message");
	expect(res.body.message).toBe("User created successfully");
	expect(res.body.user.name).toBe(user.name);

	res = await request.post("/users").send({
		name: user.name,
		email: user.email,
		password: user.password,
	});
	expect(res.status).toBe(409);
	expect(res.body).toHaveProperty("message");
	expect(res.body.message).toBe("User already exists");
});
test("POST /users/register should be 400 when input fields are not corect or missing", async () => {
	const user = {
		name: "test user",
		email: "test@email.com",
		password: "123456",
	};
	let res: Response;

	res = await request.post("/users").send({});

	expect(res.status).toBe(400);
	expect(res.body).toHaveProperty("message");

	res = await request.post("/users").send({
		// name: user.name,
		email: user.email,
		password: user.password,
	});

	expect(res.status).toBe(400);
	expect(res.body).toHaveProperty("message");

	res = await request.post("/users").send({
		name: user.name,
		// email: user.email,
		password: user.password,
	});

	expect(res.status).toBe(400);
	expect(res.body).toHaveProperty("message");

	res = await request.post("/users").send({
		name: user.name,
		email: user.email,
		// password: user.password,
	});

	expect(res.status).toBe(400);
	expect(res.body).toHaveProperty("message");
});
// test("GET /users/profile", async () => {});

// fastify.put(
// 	"/profile",
// 	{
// 		schema: {
// 			body: userSchemas.updateInfo, // Validates optional name and email
// 		},
// 		onRequest: protect,
// 	},
// 	user.updateInfoHandler,
// );
// fastify.get(
// 	"/",
// 	{
// 		onRequest: protect,
// 		preHandler: isAdmin,
// 	},
// 	user.a_getAllUsers,
// );
//
// fastify.get(
// 	"/:id",
// 	{
// 		schema: {
// 			params: userSchemas.mongoId, // Validates MongoDB ObjectId format
// 		},
// 		onRequest: protect,
// 		preHandler: isAdmin,
// 	},
// 	user.a_getUserById,
// );
//
// fastify.put(
// 	"/:id",
// 	{
// 		schema: {
// 			params: userSchemas.mongoId, // Validates ID parameter
// 			body: userSchemas.adminUpdateUser, // Validates name, email, isAdmin
// 		},
// 		onRequest: protect,
// 		preHandler: isAdmin,
// 	},
// 	user.a_updateUserInfoHandler,
// );
//
// fastify.delete(
// 	"/:id",
// 	{
// 		schema: {
// 			params: userSchemas.mongoId, // Validates MongoDB ObjectId format
// 		},
// 		onRequest: protect,
// 		preHandler: isAdmin,
// 	},
// 	user.a_deleteUser,
// );
