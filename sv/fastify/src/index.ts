import Fastify from "fastify";
import cors from "@fastify/cors";

import connect from "./utils/connection";
import userRoutes from "./routes/user";
import productRoutes from "./routes/product";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

fastify.register(cors, {
  origin: "*",
});

fastify.get("/check", function (_req, reply) {
  reply.send((reply.statusCode = 200));
});

fastify.register(userRoutes);
fastify.register(productRoutes, { prefix: "/products" });

// TODO: Better Error handling
fastify.listen({ port: 3000, host: "0.0.0.0" }, function (err, address) {
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

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, async () => {
    await fastify.close();

    process.exit(0);
  });
});
