import Fastify from "fastify";
import cors from "@fastify/cors";

import { getProducts, getProductsById } from "./controllers/products";
import connect from "./utils/connection";

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

fastify.get("/products", getProducts);

// 6543e69b2cf3befc0f2c51a7

fastify.get("/products/:id", getProductsById);

fastify.listen({ port: 3000, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
  connect()
    .then(() => console.log("CONNECTED"))
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
