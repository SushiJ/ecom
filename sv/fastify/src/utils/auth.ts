import {
  type FastifyRequest,
  type FastifyReply,
  type DoneFuncWithErrOrRes,
} from "fastify";
import userModel from "../models/User";

export async function protect(
  req: FastifyRequest,
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
    const decoded = await req.jwtDecode<{
      userId: string;
      iat: number;
      exp: number;
    }>();

    const { userId } = decoded;

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
  req: FastifyRequest,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes,
) {
  // @ts-expect-error no user or is not admin
  if (!req.user || !req.user.isAdmin) {
    reply.status(401);
    throw new Error("Not Authorized");
  }
  done();
}
