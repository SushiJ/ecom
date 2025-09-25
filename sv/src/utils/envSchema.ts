import envSchema, { JSONSchemaType } from "env-schema";
// import { z } from "zod";
//
// const envSchema = z.object({
// 	MONGO_LOCAL_URI: z.string(),
// 	MONGODB_URI: z.string(),
// 	MONGODB_TEST_URI: z.string(),
// 	MONGO_USER: z.string(),
// 	MONGO_PASS: z.string(),
// 	PORT: z.coerce.number().default(3000),
// 	RUNNING_ENV: z.enum(["local", "docker"]).default("local"),
// 	NODE_ENV: z
// 		.enum(["development", "production", "test"])
// 		.default("development"),
// });
//
// export default function getEnv() {
// 	return envSchema.parse(process.env);
// }

interface Env {
	PORT: number;
	MONGODB_URI: string;
	MONGO_USER: string;
	MONGO_PASS: string;
	NODE_ENV: string;
	MONGO_LOCAL_URI: string;
	RUNNING_ENV: string;
}

const schema: JSONSchemaType<Env> = {
	type: "object",
	required: [
		"MONGODB_URI",
		"MONGO_USER",
		"MONGO_PASS",
		"PORT",
		"NODE_ENV",
		"MONGO_LOCAL_URI",
		"RUNNING_ENV",
	],
	properties: {
		MONGO_LOCAL_URI: { type: "string" },
		RUNNING_ENV: {
			type: "string",
			enum: ["local", "docker"],
			default: "local",
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
