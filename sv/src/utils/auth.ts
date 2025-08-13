import {
	type FastifyRequest,
	type FastifyReply,
	type DoneFuncWithErrOrRes,
} from "fastify";
import userModel from "../models/User";
import { AdminUpdateUserInput, UpdateInfoInput } from "../schemas/userSchema";
import { HttpError } from "./HttpErrors";

// TODO: figure out better error mechanism
export async function protectedNoBody(
	req: FastifyRequest,
	_reply: FastifyReply,
) {
	const token = req.cookies["citrus"];

	if (!token) {
		throw HttpError.unauthorized("No token found");
	}

	try {
		const decoded = await req.jwtDecode<{
			userId: string;
			iat: number;
			exp: number;
		}>();

		const { userId } = decoded;

		const user = await userModel.findById(userId).select("-password");

		if (!user) {
			throw HttpError.unauthorized("User not found");
		}

		req.user = {
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		};
	} catch (e) {
		throw HttpError.badRequest();
	}
}

export async function protect(
	req: FastifyRequest<{
		Body: UpdateInfoInput;
	}>,
	reply: FastifyReply,
) {
	const token = req.cookies["citrus"];

	if (!token) {
		throw HttpError.unauthorized("No token found");
	}

	try {
		const decoded = await req.jwtDecode<{
			userId: string;
			iat: number;
			exp: number;
		}>();

		const { userId } = decoded;

		const user = await userModel.findById(userId).select("-password");

		if (!user) {
			reply.status(401);
			throw new Error("User not found");
		}

		req.user = {
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		};
	} catch (e) {
		console.log(e);
	}
}

export function isAdmin(
	req: FastifyRequest<{
		Params: { id: string };
		Body: AdminUpdateUserInput;
	}>,
	_reply: FastifyReply,
	done: DoneFuncWithErrOrRes,
) {
	// @ts-expect-error no user or is not admin
	if (!req.user || !req.user.isAdmin) {
		throw HttpError.forbidden("Not authorized");
	}
	done();
}
