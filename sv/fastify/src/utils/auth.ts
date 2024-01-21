import {
  type FastifyRequest,
  type FastifyReply,
  type DoneFuncWithErrOrRes,
} from "fastify";
import userModel from "../models/User";

export async function auth(
  req: FastifyRequest<{
    Body: {
      email: string;
      password: string;
    };
  }>,
  rep: FastifyReply,
  done: DoneFuncWithErrOrRes,
) {
  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  const token = req.cookies["citrus"];

  if (!token) {
    rep.status(401);
    throw new Error("Not Authorized, No token");
  }

  try {
    const decoded = await req.jwtVerify();
    console.log("decoded:", decoded);

    const userId = decoded.toString();
    console.log("User :", userId);

    const user = await userModel.findById(userId).select("-password");

    // WARN: this should never happen?
    if (!user) {
      rep.status(401);
      throw new Error("User? Where");
    }

    req.user = user;
    done();
  } catch (e) {
    rep.status(400);
    throw new Error("What?");
  }
}

export function isAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes,
) {
  // @ts-expect-error no user or is not admin
  if (!request.user || !request.user.isAdmin) {
    reply.status(401);
    throw new Error("Not Authorized");
  }
  done();
}
