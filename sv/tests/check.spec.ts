import { FastifyInstance } from "fastify";
import { build } from "../src/index";
import request from "supertest";
import { type IncomingMessage, type Server, type ServerResponse } from "http";
import { type FastifyBaseLogger } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";

let app: FastifyInstance<
	Server<typeof IncomingMessage, typeof ServerResponse>,
	IncomingMessage,
	ServerResponse<IncomingMessage>,
	FastifyBaseLogger,
	ZodTypeProvider
>;

beforeAll(async () => {
	app = build();
	await app.ready();
});

afterAll(async () => {
	await app.close();
});

test("GET /check returns OK", async () => {
	const res = await request(app.server).get("/check").expect(200);
	expect(res.text).toBe("OK");
});
