import { type FastifyInstance } from "fastify";
import User from "../controllers/user";
import { isAdmin, protect } from "../utils/auth";

async function userRoutes(fastify: FastifyInstance) {
  const user = new User();
  //TODO: Add schema validation
  fastify.post("/login", user.loginHandler);
  fastify.post("/logout", user.logoutHandler);

  fastify.get("/profile", { onRequest: protect }, user.getInfoHandler);
  fastify.put("/profile", { preHandler: protect }, user.updateInfoHandler);

  fastify.post("/", user.registerHandler);
  fastify.get("/", { onRequest: [protect, isAdmin] }, user.a_getAllUsers);

  fastify.get("/:id", { onRequest: [protect, isAdmin] }, user.a_getUserById);
  fastify.put(
    "/:id",
    { onRequest: [protect, isAdmin] },
    user.a_updateUserInfoHandler,
  );
  fastify.delete("/:id", { onRequest: [protect, isAdmin] }, user.a_deleteUser);

  fastify.log.info("User routes registered");
}

export default userRoutes;
