import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import cookie, { type FastifyCookieOptions } from "@fastify/cookie";
import cors from "@fastify/cors";
import env from "@fastify/env";
import jwt from "@fastify/jwt";
import {
	ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

import productRoutes from "./routes/product";
import userRoutes from "./routes/user";
import orderRoutes from "./routes/order";
import { HttpError } from "./utils/HttpErrors";

export function build() {
	const fastify = Fastify({
		logger: {
			transport: {
				target: "pino-pretty",
			},
		},
	}).withTypeProvider<ZodTypeProvider>();

	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	// TODO: Figure out envs and schema
	fastify.register(env, {
		dotenv: true,
		schema: {},
	});

	fastify.register(cors, {
		// INFO: directly borrowed from cors doc
		// Development mode only
		origin:
			process.env.NODE_ENV === "testing"
				? ["*"]
				: (origin, cb) => {
						const { hostname } = new URL(origin!);
						if (hostname === "localhost") {
							cb(null, true);
						}
						// TODO: check hostname from the envs
					},
		credentials: true, // Needed for cors in browser
		methods: ["GET", "POST", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});

	fastify.register(cookie, {
		secret: "secret",
		hook: "onRequest",
	} as FastifyCookieOptions);

	fastify.register(jwt, {
		secret: "supersecret",
		verify: {
			extractToken: (request) => request.cookies.citrus,
		},
		sign: {
			// TODO: Change this later
			expiresIn: "30d",
		},
	});

	fastify.get("/check", (_req, reply) => {
		return reply.status(200).send("OK");
	});

	fastify.register(userRoutes, { prefix: "/users" });
	fastify.register(productRoutes, { prefix: "/products" });
	fastify.register(orderRoutes, { prefix: "/orders" });

	fastify.setErrorHandler((error, request, reply) => {
		fastify.log.error({
			error,
			request: {
				method: request.method,
				url: request.url,
				query: request.query,
				params: request.params,
			},
		});

		// Zod validation errors
		if (error.validation) {
			const validationErrors = error.validation.map((err) => ({
				field:
					err.instancePath.replace("/", "") ||
					err.params?.missingProperty ||
					"unknown",
				message: err.message,
			}));

			return reply.status(400).send({
				error: "Validation Error",
				message: "The request data is invalid",
				details: validationErrors,
			});
		}
		// HTTP Errors
		if (HttpError.isHttpError(error)) {
			return reply.status(error.statusCode).send({
				error: error.name,
				message: error.message,
				...(process.env.NODE_ENV === "development" && { stack: error.stack }),
			});
		}

		// Default error response for other errors
		const statusCode = error.statusCode || 500;
		return reply.status(statusCode).send({
			error: error.name || "Internal Server Error",
			message: error.message || "Something went wrong",
			...(process.env.NODE_ENV === "development" && { stack: error.stack }),
		});
	});

	// PAYPAL
	fastify.get(
		"/api/config/paypal",
		(_request: FastifyRequest, reply: FastifyReply) =>
			reply.status(200).send({
				clientId: process.env.PAYPAL_CLIENT_ID,
			}),
	);

	return fastify;
}
