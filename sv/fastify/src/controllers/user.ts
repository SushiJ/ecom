import { type FastifyReply, type FastifyRequest } from "fastify";

class User {
  static async registerHandler(
    _req: FastifyRequest<{
      Body: {
        name: string;
        age: number;
      };
    }>,
    reply: FastifyReply,
  ) {
    // const { id } = req.params;
    try {
      reply.status(200).send();
    } catch (e) {
      console.log(e);
      reply.status(500).send("Internal server Error");
    }
  }

  static async loginHandler(_req: FastifyRequest, reply: FastifyReply) {
    try {
      reply.status(200).send();
    } catch (e) {
      reply.status(500).send("Internal server Error");
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
    reply.status(200);
  }
  static async getUserById(_req: FastifyRequest, reply: FastifyReply) {
    reply.status(200);
    return;
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
