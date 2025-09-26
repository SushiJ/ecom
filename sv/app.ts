import { build } from "./src/index";
import { connect } from "./src/utils/connection";

const fastify = build();

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
		fastify.log.error(e);
		fastify.log.error("Failed to connect to server");
	}
});

["SIGINT", "SIGTERM"].forEach((signal) => {
	process.on(signal, async () => {
		await fastify.close();
		process.exit(0);
	});
});
