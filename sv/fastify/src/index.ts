import cors from "@fastify/cors";
import Fastify from "fastify";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import env from "@fastify/env";

import productRoutes from "./routes/product";
import userRoutes from "./routes/user";
import connect from "./utils/connection";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

fastify.register(env, {
  dotenv: true,
});

fastify.register(cookie);

fastify.register(jwt, {
  secret: "supersecret",
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
  if (err.message) {
    res.send({ status: res.statusCode, error: err.message.slice(7) });
    return;
  }
  res.code(500).send({ status: 500, error: "Internal Server Error" });
});

fastify.get("/check", (_req, reply) => {
  return reply.status(200).send("OK");
});

fastify.register(userRoutes, { prefix: "/users" });
fastify.register(productRoutes, { prefix: "/products" });

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
