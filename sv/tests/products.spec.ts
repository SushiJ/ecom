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
