import { type FastifyInstance } from "fastify";
import User from "../controllers/user";
import { isAdmin, protect } from "../utils/auth";
import { userSchemas } from "../schemas/userSchema";

async function userRoutes(fastify: FastifyInstance) {
	const user = new User();

	fastify.post(
		"/login",
		{
			schema: {
				body: userSchemas.login,
			},
		},
		user.loginHandler,
	);

	fastify.post("/logout", user.logoutHandler);

	fastify.get(
		"/profile",
		{
			onRequest: protect,
		},
		user.getInfoHandler,
	);

	fastify.put(
		"/profile",
		{
			schema: {
				body: userSchemas.updateInfoWithPass, // Validates optional name and email
			},
			onRequest: protect,
		},
		user.updateInfoHandler,
	);

	fastify.post(
		"/",
		{
			schema: {
				body: userSchemas.register, // Validates name, email, password
			},
		},
		user.registerHandler,
	);

	fastify.get(
		"/",
		{
			onRequest: protect,
			preHandler: isAdmin,
		},
		user.a_getAllUsers,
	);

	fastify.get(
		"/:id",
		{
			schema: {
				params: userSchemas.mongoId, // Validates MongoDB ObjectId format
			},
			onRequest: protect,
			preHandler: isAdmin,
		},
		user.a_getUserById,
	);

	fastify.put(
		"/:id",
		{
			schema: {
				params: userSchemas.mongoId, // Validates ID parameter
				body: userSchemas.adminUpdateUser, // Validates name, email, isAdmin
			},
			onRequest: protect,
			preHandler: isAdmin,
		},
		user.a_updateUserInfoHandler,
	);

	fastify.delete(
		"/:id",
		{
			schema: {
				params: userSchemas.mongoId, // Validates MongoDB ObjectId format
			},
			onRequest: protect,
			preHandler: isAdmin,
		},
		user.a_deleteUser,
	);

	fastify.log.info("User routes registered");
}

export default userRoutes;
