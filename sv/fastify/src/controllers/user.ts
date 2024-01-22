import { type FastifyReply, type FastifyRequest } from "fastify";
import userModel from "../models/User";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class User {
  // TODO:
  static async registerHandler(
    req: FastifyRequest<{
      Body: {
        email: string;
        name: string;
        password: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { name, email } = req.body;
      const userExists = await User.getUserByEmail(email);

      if (userExists) {
        reply.status(400);
        throw new Error("User already exists");
      }

      await userModel.create({ name, email });
    } catch (e) {
      console.log(e);
      reply.status(500).send("Internal server Error");
    }
  }

  static async loginHandler(
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

      if (!user || (await user.matchPassword(password))) {
        reply.status(401);
        throw new Error("Invalid credentials");
      }

      const token = await reply.jwtSign({
        userId: user._id,
      });

      return reply
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
    } catch (e) {
      throw new Error(e as string);
    }
  }

  static async logoutHandler(_req: FastifyRequest, reply: FastifyReply) {
    reply.status(200);
  }

  static async getInfoHandler(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user;
    return reply.status(200).send(user);
  }

  static async updateInfoHandler(_req: FastifyRequest, reply: FastifyReply) {
    reply.status(200);
  }

  static async getUserByEmail(email: string) {
    const user = await userModel.findOne({ email });
    return user;
  }

  // Admin actions
  static async a_getAllUsers(_req: FastifyRequest, reply: FastifyReply) {
    const users = await userModel.find();
    reply.status(200).send(users);
    return reply;
  }

  // FIXME: This "as" business IDK But it works for now
  static async a_getUserById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    try {
      const user = await userModel.findById({
        id,
      });

      if (!user) {
        reply.status(400).send("Not Found");
        return reply;
      }

      return reply.status(200).send(user);
    } catch (e) {
      console.log(e);
      throw new Error("IDK YET");
    }
  }

  static async a_deleteUser(_req: FastifyRequest, reply: FastifyReply) {
    reply.status(200);
    return reply;
  }

  static async a_updateUserInfoHandler(
    _req: FastifyRequest,
    reply: FastifyReply,
  ) {
    reply.status(200);
    return;
  }
}

export default User;
