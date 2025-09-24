import mongoose from "mongoose";

// mongodb://mongo:mongo@mongo:27017/ecom?authSource=admin
// const MONGO_URL = "mongodb://mongo:27017/";

const uri = "mongodb://mongo:mongo@localhost:27017/";

export async function connect() {
	return mongoose.connect(uri, {
		dbName: "ecom",
		pass: "mongo",
		user: "mongo",
	});
}

export async function connectTestDb() {
	return mongoose.connect(uri, {
		dbName: "test_db",
		pass: "mongo",
		user: "mongo",
	});
}

export async function disconnectTestDatabase() {
	await mongoose.disconnect();
}
