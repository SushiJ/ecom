import { type FastifyReply, type FastifyRequest } from "fastify";
import userModel from "../models/User";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class User {
  // TODO: Validation for request body thingy
  async registerHandler(
    req: FastifyRequest<{
      Body: {
        name: string;
        email: string;
        password: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    const { name, email, password } = req.body;
    const userExists = await userModel.findOne({ email }).select("-password");

    if (userExists) {
      reply.status(409);
      throw new Error("User already exists");
    }

    try {
      await userModel.create({ name, email, password });
      reply.status(201);
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async loginHandler(
    req: FastifyRequest<{
      Body: {
        email: string;
        password: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { email, password } = req.body;

      const user = await User.getUserByEmail(email);

      if (!user || !user.passwordMatch(password)) {
        reply.status(401);
        throw new Error("Invalid credentials");
      }

      const token = await reply.jwtSign({
        userId: user._id,
      });

      reply
        .setCookie("citrus", token, {
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: true,
          maxAge: 30 * 24 * 60 * 60,
        })
        .status(200)
        .send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        });
      return reply;
    } catch (e) {
      console.log(e);
      throw new Error(e as string);
    }
  }

  async logoutHandler(_req: FastifyRequest, reply: FastifyReply) {
    reply
      .setCookie("citrus", "", {
        httpOnly: true,
        path: "/",
        sameSite: true,
        maxAge: 0,
      })
      .status(200)
      .send();
    return reply;
  }

  async getInfoHandler(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user;
    return reply.status(200).send(user);
  }

  async updateInfoHandler(_req: FastifyRequest, reply: FastifyReply) {
    reply.status(200);
  }

  static async getUserByEmail(email: string) {
    const user = await userModel.findOne({ email });
    return user;
  }

  // Admin actions
  async a_getAllUsers(_req: FastifyRequest, reply: FastifyReply) {
    const users = await userModel.find().select("-password");
    reply.status(200).send(users);
    return reply;
  }

  // FIXME: This "as" business IDK But it works for now
  async a_getUserById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    try {
      const user = await userModel
        .findById({
          id,
        })
        .select("-password");

      if (!user) {
        reply.status(400).send("Not Found");
        return reply;
      }

      return reply.status(200).send({ status: 200, data: user });
    } catch (e) {
      console.log(e);
      throw new Error("IDK YET");
    }
  }

  async a_deleteUser(_req: FastifyRequest, reply: FastifyReply) {
    reply.status(200);
    return reply;
  }

  async a_updateUserInfoHandler(_req: FastifyRequest, reply: FastifyReply) {
    reply.status(200);
    return;
  }
}

export default User;
