import { build } from "./src/index";
import { connect, connectDevDB, connectTestDb } from "./src/utils/connection";
import { config } from "./src/utils/envSchema";

const fastify = build();

fastify.listen({ port: 3000, host: "0.0.0.0" }, async (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	try {
		"testing" === config.NODE_ENV ? await connectTestDb() : "";
		"development" === config.NODE_ENV ? await connectDevDB() : "";
		"production" === config.NODE_ENV ? await connect() : "";
		fastify.log.info(config);

		fastify.log.info("CONNECTED TO MONGO");
		fastify.log.info(`server listening on ${address}`);
	} catch (e) {
		fastify.log.error(e);
		fastify.log.error("Failed to connect to server");
		process.exit(1);
	}
});

["SIGINT", "SIGTERM"].forEach((signal) => {
	process.on(signal, async () => {
		await fastify.close();
		process.exit(0);
	});
});
