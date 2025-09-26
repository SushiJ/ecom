import mongoose from "mongoose";
import { config } from "./envSchema";

const MONGO_URL =
	config.RUNNING_ENV === "docker" ? config.MONGODB_URI : config.MONGO_LOCAL_URI;

export async function connect() {
	return mongoose.connect(MONGO_URL, {
		dbName: "ecom",
		pass: "mongo",
		user: "mongo",
	});
}

export async function connectTestDb() {
	return mongoose.connect(MONGO_URL, {
		dbName: "test_db",
		pass: "mongo",
		user: "mongo",
	});
}

export async function disconnectTestDatabase() {
	await mongoose.disconnect();
}
