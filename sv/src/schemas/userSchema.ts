import { z } from "zod";

export const userSchemas = {
	register: z.object({
		name: z.string().min(2, "Name must be at least 2 characters").max(50),
		email: z.email("Invalid email format"),
		password: z.string().min(6, "Password must be at least 6 characters"),
	}),

	login: z.object({
		email: z.email("Invalid email format"),
		password: z.string().min(1, "Password is required"),
	}),

	updateInfo: z.object({
		name: z.string().min(2).max(50).optional(),
		email: z.email().optional(),
	}),

	// Admin schemas
	adminUpdateUser: z.object({
		name: z.string().min(2).max(50),
		email: z.email(),
		role: z.string(),
	}),
	mongoId: z.object({
		id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
	}),
};

export type RegisterInput = z.infer<typeof userSchemas.register>;
export type LoginInput = z.infer<typeof userSchemas.login>;
export type UpdateInfoInput = z.infer<typeof userSchemas.updateInfo>;
export type AdminUpdateUserInput = z.infer<typeof userSchemas.adminUpdateUser>;
export type MongoIdInput = z.infer<typeof userSchemas.mongoId>;
