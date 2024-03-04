import { type FastifyReply, type FastifyRequest } from "fastify";
import userModel from "../models/User";

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

    await userModel.create({ name, email, password });

    return reply.status(201);
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
    const { email, password } = req.body;

    const user = await User.getUserByEmail(email);

    if (!user || !user.passwordMatch(password)) {
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
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60,
        sameSite: "strict",
      })
      .status(200)
      .send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
  }

  async logoutHandler(_req: FastifyRequest, reply: FastifyReply) {
    reply
      .setCookie("citrus", "", {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
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

  async updateInfoHandler(req: FastifyRequest, reply: FastifyReply) {
    const decodedUser = req.user as { _id: string };

    const { name, email } = req.body as { name?: string; email?: string };

    const user = await userModel.findById(decodedUser._id);

    if (!user) {
      reply.status(400);
      throw new Error("HUH");
    }

    user.name = name ? name : user.name;
    user.email = email ? email : user.email;

    const updatedUser = await user.save();

    return reply.status(200).send(updatedUser);
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
    const user = await userModel.findById(id).select("-password");

    if (!user) {
      reply.status(400);
      throw new Error("Not user with that Id");
    }

    return reply.status(200).send(user);
  }

  async a_deleteUser(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };

    const user = await userModel.findById(id);

    if (user?.isAdmin) {
      reply.status(400);
      throw new Error("Hey, You can't do that");
    }

    const deletedUser = await userModel.deleteOne({ _id: user?._id });

    return reply.status(200).send(deletedUser);
  }

  async a_updateUserInfoHandler(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };

    const { name, email, isAdmin } = req.body as {
      name: string;
      email: string;
      isAdmin: boolean;
    };

    const user = await userModel.findById(id);

    if (!user) {
      reply.status(400);
      throw new Error("Done goofed, it ain't there");
    }

    user.name = name;
    user.email = email;
    user.isAdmin = isAdmin;

    const updatedUser = await user.save();

    return reply.status(200).send(updatedUser);
  }
}

export default User;
