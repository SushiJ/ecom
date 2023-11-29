import { type FastifyInstance } from "fastify";
import User from "../controllers/user";

async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/", User.registerHandler).get("/", User.getAllUsers);

  fastify.log.info("User routes registered");
}

export default userRoutes;
