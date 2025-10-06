import mongoose from "mongoose";
import { config } from "./envSchema";

const MONGO_URL =
	config.RUNNING_ENV === "docker" ? config.MONGODB_URI : config.MONGO_LOCAL_URI;

export async function connect() {
	console.info("CONNECTING TO PROD_DB");
	return mongoose.connect(MONGO_URL, {
		dbName: "ecom",
		pass: "mongo",
		user: "mongo",
	});
}

export async function connectDevDB() {
	console.info("CONNECTING TO DEV_DB");
	return mongoose.connect(MONGO_URL, {
		dbName: "dev_db",
		pass: "mongo",
		user: "mongo",
	});
}

export async function connectTestDb() {
	console.info("CONNECTING TO TEST_DB");
	return mongoose.connect(MONGO_URL, {
		dbName: "test_db",
		pass: "mongo",
		user: "mongo",
	});
}

export async function disconnectTestDatabase() {
	await mongoose.disconnect();
}
