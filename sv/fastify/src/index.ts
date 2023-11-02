import Fastify from "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";

import { products } from "../initialData";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

fastify.get("/check", function(_req, reply) {
  reply.send((reply.statusCode = 200));
});

fastify.get("/products", function(_req, reply: FastifyReply) {
  reply.send(products);
});

fastify.get(
  "/products/:id",
  function(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const product = products.find((p) => p._id === +id);
    if (!product) {
      reply.status(404);
      return;
    }
    reply.status(200).send(product);
  },
);

fastify.listen({ port: 3000, host: "0.0.0.0" }, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, async () => {
    await fastify.close();

    process.exit(0);
  });
});
