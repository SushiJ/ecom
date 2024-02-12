import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import env from "@fastify/env";
import jwt from "@fastify/jwt";
import Fastify from "fastify";

import productRoutes from "./routes/product";
import userRoutes from "./routes/user";
import connect from "./utils/connection";
import orderRoutes from "./routes/order";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

fastify.register(env, {
  dotenv: true,
  schema: {},
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

fastify.register(cors, {
  origin: "*",
});

fastify.setErrorHandler((err, req, res) => {
  req.log.error({ err }, err.message);
  if (!err.message) {
    res.status(500).send({ status: 500, error: "Internal Server Error" });
  }
  res.send({ status: res.statusCode, error: err.message });
  return res;
});

fastify.get("/check", (_req, reply) => {
  return reply.status(200).send("OK");
});

fastify.register(userRoutes, { prefix: "/users" });
fastify.register(productRoutes, { prefix: "/products" });
fastify.register(orderRoutes, { prefix: "/orders" });

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  connect()
    .then(() => {
      console.log("CONNECTED");
    })
    .then(() => fastify.log.info(`server listening on ${address}`))
    .catch((e) => {
      fastify.log.error(e);
    });
});

// biome-ignore lint/complexity/noForEach: <explanation>
["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, async () => {
    await fastify.close();

    process.exit(0);
  });
});
