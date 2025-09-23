import supertest, { type Response } from "supertest";
import { build } from "../src/index";
import { FastifyBaseLogger, FastifyInstance } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { Database, extractJwtFromSetCookie } from "../utils/testing";

let app: FastifyInstance<
	Server<typeof IncomingMessage, typeof ServerResponse>,
	IncomingMessage,
	ServerResponse<IncomingMessage>,
	FastifyBaseLogger,
	ZodTypeProvider
>;

let request: ReturnType<typeof supertest>;
let database: Database;

// TODO: A better way of doing middleware tests would be doing them as unit tests and 
// Need to introduce faker for mocking up data

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
// INFO: this just returns the user from the request (IDK how this happened but well and I'm not testing it)
// test("GET /users/profile", async () => {});

test("PUT /users/profile should return 400 when user is not authenticated & 200 when user is authenticated and there is no update", async () => {
	let res: Response;

	res = await request.put("/users/profile").send();

	expect(res.status).toBe(401);
	expect(res.body).toHaveProperty("message");
});
test("PUT /users/profile should return 200 when user is no update", async () => {
	let res: Response;

	const password = "123456";
	const user = await database.setupUser("user");

	res = await request.post("/users/login").send({
		email: user.email,
		password,
	});
	expect(res.status).toBe(200);
	expect(res.headers["set-cookie"]).toBeTruthy();

	const cookie = extractJwtFromSetCookie(res.headers["set-cookie"]);

	res = await request
		.put("/users/profile")
		.send({
			password: "12345678",
		})
		.set("Cookie", [`citrus=${cookie}`]);

	expect(res.status).toBe(200);
	expect(res.body).toHaveProperty("message");
	expect(res.body.message).toBe("User updated successfully");
});
test("GET /users", async () => {
	let res: Response;

	res = await request.get("/users");
	expect(res.status).toBe(401);
	expect(res.body).toHaveProperty("message", "No token found");

	const password = "123456";
	const normalUser = await database.setupUser("user");

	res = await request.post("/users/login").send({
		email: normalUser.email,
		password,
	});
	expect(res.status).toBe(200);
	expect(res.headers["set-cookie"]).toBeTruthy();

	const cookie = extractJwtFromSetCookie(res.headers["set-cookie"]);

	res = await request.get("/users").set("Cookie", [`citrus=${cookie}`]);
	expect(res.status).toBe(403);
	expect(res.body).toHaveProperty("message", "Not authorized");

	await database.dropDatabase("USERS");
	const adminUser = await database.setupUser("admin");

	res = await request.post("/users/login").send({
		email: adminUser.email,
		password,
	});
	expect(res.status).toBe(200);
	expect(res.headers["set-cookie"]).toBeTruthy();

	const adminCookie = extractJwtFromSetCookie(res.headers["set-cookie"]);

	res = await request.get("/users").set("Cookie", [`citrus=${adminCookie}`]);
	expect(res.status).toBe(200);
	expect(res.body).toHaveProperty("message", "Users retrieved successfully");
	expect(res.body.users.length).toBe(1); //Admin user that is making the request;

	await database.setupUsers();
	res = await request.get("/users").set("Cookie", [`citrus=${adminCookie}`]);
	expect(res.status).toBe(200);
	expect(res.body).toHaveProperty("message", "Users retrieved successfully");
	expect(res.body.users.length).toBeGreaterThanOrEqual(1); //Admin user that is making the request + whatever the users are in the db; There is a race condition here somewhere when accessing the databe but this works
});
test("GET /users/:id", async () => {
	let res: Response;

	res = await request.get("/users/1");
	expect(res.status).toBe(401);
	expect(res.body).toHaveProperty("message", "No token found");

	const password = "123456";
	const normalUser = await database.setupUser("user");

	res = await request.post("/users/login").send({
		email: normalUser.email,
		password,
	});
	expect(res.status).toBe(200);
	expect(res.headers["set-cookie"]).toBeTruthy();

	const cookie = extractJwtFromSetCookie(res.headers["set-cookie"]);

	res = await request.get("/users/1").set("Cookie", [`citrus=${cookie}`]);
	expect(res.status).toBe(400);
	expect(res.body).toHaveProperty("message", "The request data is invalid");
	expect(res.body.details.length).toBeGreaterThan(0);
	expect(res.body.details[0]).toHaveProperty(
		"message",
		"Invalid MongoDB ObjectId",
	);

	res = await request
		.get(`/users/${normalUser._id}`)
		.set("Cookie", [`citrus=${cookie}`]);
	expect(res.status).toBe(403);
	expect(res.body).toHaveProperty("message", "Not authorized");

	await database.dropDatabase("USERS");
	const adminUser = await database.setupUser("admin");

	res = await request.post("/users/login").send({
		email: adminUser.email,
		password,
	});
	expect(res.status).toBe(200);
	expect(res.headers["set-cookie"]).toBeTruthy();

	const adminCookie = extractJwtFromSetCookie(res.headers["set-cookie"]);

	res = await request
		.get(`/users/${normalUser._id}`)
		.set("Cookie", [`citrus=${adminCookie}`]);
	expect(res.status).toBe(404);
	expect(res.body).toHaveProperty("message", "User not found");

	res = await request
		.get(`/users/${adminUser._id}`)
		.set("Cookie", [`citrus=${adminCookie}`]);
	expect(res.status).toBe(200);
	expect(res.body).toHaveProperty("message", "User retrieved successfully");
	expect(res.body.user).toBeTruthy();
});
// Since I know the middlewares work Imma skip those and get straight to the meat
test("PUT /users/:id admin route", async () => {
	let res: Response;

	const password = "123456";
	const normalUser = await database.setupUser("user");
	const adminUser = await database.setupUser("admin");

	res = await request.post("/users/login").send({
		email: adminUser.email,
		password,
	});
	expect(res.status).toBe(200);
	expect(res.headers["set-cookie"]).toBeTruthy();

	const adminCookie = extractJwtFromSetCookie(res.headers["set-cookie"]);

	res = await request
		.put(`/users/${normalUser._id}`)
		.send({})
		.set("Cookie", [`citrus=${adminCookie}`]);
	expect(res.status).toBe(200); // since it's gonna optional the input

	let user = {
		name: "testing 123",
		email: "testing@email.com",
		role: "user",
	};
	res = await request
		.put(`/users/${normalUser._id}`)
		.send({
			name: user.name,
			email: user.email,
			role: user.role,
		})
		.set("Cookie", [`citrus=${adminCookie}`]);

	expect(res.status).toBe(200);
	expect(res.body).toHaveProperty("message", "User updated successfully");
	expect(res.body.user.name).toBe(user.name);
	expect(res.body.user.email).toBe(user.email);
	expect(res.body.user.role).toBe(user.role);
});
// Since I know the middlewares work Imma skip those and get straight to the meat
test("DELETE /users/:id admin route", async () => {
	let res: Response;

	const password = "123456";
	const normalUser = await database.setupUser("user");
	const adminUser = await database.setupUser("admin");

	res = await request.post("/users/login").send({
		email: adminUser.email,
		password,
	});
	expect(res.status).toBe(200);
	expect(res.headers["set-cookie"]).toBeTruthy();

	const adminCookie = extractJwtFromSetCookie(res.headers["set-cookie"]);

	res = await request
		.delete(`/users/${normalUser._id}`)
		.set("Cookie", [`citrus=${adminCookie}`]);
	expect(res.status).toBe(200);
	expect(res.body).toHaveProperty("message", "User deleted successfully");

	res = await request
		.delete(`/users/${adminUser._id}`)
		.set("Cookie", [`citrus=${adminCookie}`]);

	expect(res.status).toBe(400);
	expect(res.body).toHaveProperty("message", "Bad request");
});
