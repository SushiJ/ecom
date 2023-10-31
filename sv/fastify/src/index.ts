import Fastify from "fastify";

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

fastify.listen({ port: 3000, host: "0.0.0.0" }, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
