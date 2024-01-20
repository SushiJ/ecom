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

  static async updateInfoHandler(_req: FastifyRequest, reply: FastifyReply) {
    reply.status(200);
  }

  // Admin actions
  static async getAllUsers(_req: FastifyRequest, reply: FastifyReply) {
    reply.status(200).send();
  }

  static async getUserById(_req: FastifyRequest, reply: FastifyReply) {
    reply.status(200);
    return;
  }
  static async getUserByEmail(email: string) {
    const user = await userModel.findOne({ email });
    return user;
  }
  static async deleteUser(_req: FastifyRequest, reply: FastifyReply) {
    reply.status(200);
    return;
  }

  static async updateUser(_req: FastifyRequest, reply: FastifyReply) {
    reply.status(200);
    return;
  }
}

export default User;
