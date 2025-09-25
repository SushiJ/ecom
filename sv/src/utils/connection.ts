import mongoose from "mongoose";
import { config } from "./envSchema";

const MONGO_URL =
	config.NODE_ENV === "development" || "testing"
		? config.MONGO_LOCAL_URI
		: config.MONGODB_URI;

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
