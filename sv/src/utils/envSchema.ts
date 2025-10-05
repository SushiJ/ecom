import envSchema, { JSONSchemaType } from "env-schema";

interface Env {
	PORT: number;
	MONGODB_URI: string;
	MONGO_USER: string;
	MONGO_PASS: string;
	NODE_ENV: string;
	MONGO_LOCAL_URI: string;
	RUNNING_ENV: string;
	MONGO_DATABASE_NAME: string;
}

const schema: JSONSchemaType<Env> = {
	type: "object",
	required: [
		"MONGODB_URI",
		"MONGO_USER",
		"MONGO_PASS",
		"PORT",
		"NODE_ENV",
		"RUNNING_ENV",
		"MONGO_DATABASE_NAME",
	],
	properties: {
		MONGO_LOCAL_URI: { type: "string" },
		RUNNING_ENV: {
			type: "string",
			enum: ["local", "docker"],
			default: "local",
		},
		MONGO_DATABASE_NAME: {
			type: "string",
			enum: ["test_db", "production_db", "dev_db"],
			default: "dev_db",
		},
		MONGODB_URI: { type: "string" },
		MONGO_USER: { type: "string" },
		MONGO_PASS: { type: "string" },
		PORT: { type: "number", default: 3000 },
		NODE_ENV: {
			type: "string",
			enum: ["development", "production", "testing"],
			default: "development",
		},
	},
};

export const config = envSchema({
	schema: schema,
	dotenv: true,
});
