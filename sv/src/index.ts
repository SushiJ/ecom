import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import env from "@fastify/env";
import jwt from "@fastify/jwt";
import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import {
	ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

import productRoutes from "./routes/product";
import userRoutes from "./routes/user";
import connect from "./utils/connection";
import orderRoutes from "./routes/order";
import { HttpError } from "./utils/HttpErrors";

const fastify = Fastify({
	logger: {
		transport: {
			target: "pino-pretty",
		},
	},
}).withTypeProvider<ZodTypeProvider>();

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(env, {
	dotenv: true,
	schema: {},
});

fastify.register(cors, {
	origin: "http://localhost:5173",
	credentials: true,
	methods: ["GET", "POST", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
});

fastify.register(cookie);

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

fastify.setErrorHandler((error, _request, reply) => {
	fastify.log.error(error);

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

fastify.listen({ port: 3000, host: "0.0.0.0" }, async (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	try {
		await connect();
		fastify.log.info("CONNECTED TO MONGO");
		fastify.log.info(`server listening on ${address}`);
	} catch (e) {
		fastify.log.error("Failed to connect to server");
	}
});

["SIGINT", "SIGTERM"].forEach((signal) => {
	process.on(signal, async () => {
		await fastify.close();

		process.exit(0);
	});
});
