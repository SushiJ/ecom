import { type FastifyInstance } from "fastify";
import User from "../controllers/user";
import { auth } from "../utils/auth";

async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/", User.registerHandler).get("/", User.getAllUsers);
  // TODO: Add preHandler
  fastify.post("/login", User.loginHandler);
  fastify
    .get("/profile", User.getUserById)
    .put("/profile", User.updateInfoHandler);

  fastify.log.info("User routes registered");
}

export default userRoutes;
