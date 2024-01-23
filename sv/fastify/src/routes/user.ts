import { type FastifyInstance } from "fastify";
import User from "../controllers/user";
import { isAdmin, protect } from "../utils/auth";

async function userRoutes(fastify: FastifyInstance) {
  //TODO: Add schema validation
  fastify.post("/login", User.loginHandler);
  fastify.get("/logout", User.logoutHandler);

  fastify
    .get("/profile", { onRequest: protect }, User.getInfoHandler)
    .put("/profile", { preHandler: protect }, User.updateInfoHandler);

  fastify
    .post("/", User.registerHandler)
    .get("/", { onRequest: [protect, isAdmin] }, User.a_getAllUsers);
  fastify
    .get("/:id", { onRequest: [protect, isAdmin] }, User.a_getUserById)
    .put(
      "/:id",
      { onRequest: [protect, isAdmin] },
      User.a_updateUserInfoHandler,
    )
    .delete("/:id", { onRequest: [protect, isAdmin] }, User.a_deleteUser);

  fastify.log.info("User routes registered");
}

export default userRoutes;
