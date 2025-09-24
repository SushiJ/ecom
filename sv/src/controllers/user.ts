import { type FastifyReply, type FastifyRequest } from "fastify";

import {
	type RegisterInput,
	type LoginInput,
	AdminUpdateUserInput,
	UpdateInfoInputWithPass,
} from "../schemas/userSchema";
import userModel from "../models/User";
import { HttpError } from "../utils/HttpErrors";

class User {
	async registerHandler(
		req: FastifyRequest<{
			Body: RegisterInput;
		}>,
		reply: FastifyReply,
	) {
		const { name, email, password } = req.body;
		const userExists = await userModel.findOne({ email }).select("-password");

		if (userExists) {
			throw HttpError.conflict("User already exists");
		}

		const newUser = await userModel.create({ name, email, password });

		return reply.status(201).send({
			message: "User created successfully",
			user: {
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
			},
		});
	}

	async loginHandler(
		req: FastifyRequest<{
			Body: LoginInput;
		}>,
		reply: FastifyReply,
	) {
		const { email, password } = req.body;

		const user = await User.getUserByEmail(email);

		if (!user) {
			throw HttpError.unauthorized("Invalid credentials");
		}

		if (!(await user.passwordMatch(password))) {
			throw HttpError.unauthorized("Invalid credentials");
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
				message: "Login successfull",
				user: {
					_id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
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
			.send({ message: "Log out successfull" });
		return reply;
	}

	async getInfoHandler(req: FastifyRequest, reply: FastifyReply) {
		const user = req.user;
		return reply.status(200).send({
			message: "Success",
			user,
		});
	}

	async updateInfoHandler(
		req: FastifyRequest<{
			Body: UpdateInfoInputWithPass;
		}>,
		reply: FastifyReply,
	) {
		const decodedUser = req.user as { _id: string };

		const { name, email, password } = req.body;

		const user = await userModel.findById(decodedUser._id);

		// INFO: this should not happen from the app
		if (!user) {
			throw HttpError.notFound("User not found");
		}

		if (name !== undefined) user.name = name;
		if (email !== undefined) user.email = email;
		if (password !== undefined) user.password = password;

		const updatedUser = await user.save();

		return reply.status(200).send({
			message: "User updated successfully",
			user: {
				_id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email,
			},
		});
	}

	static async getUserByEmail(email: string) {
		const user = await userModel.findOne({ email });
		return user;
	}

	// Admin actions
	async a_getAllUsers(_req: FastifyRequest, reply: FastifyReply) {
		const users = await userModel.find().select("-password");
		return reply.status(200).send({
			message: "Users retrieved successfully",
			users,
		});
	}

	async a_getUserById(
		req: FastifyRequest<{
			Params: { id: string };
		}>,
		reply: FastifyReply,
	) {
		const { id } = req.params;
		const user = await userModel.findById(id).select("-password");

		if (!user) {
			throw HttpError.notFound("User not found");
		}

		return reply.status(200).send({
			message: "User retrieved successfully",
			user,
		});
	}

	async a_deleteUser(
		req: FastifyRequest<{
			Params: { id: string };
		}>,
		reply: FastifyReply,
	) {
		const { id } = req.params;

		const user = await userModel.findById(id);

		if (!user) {
			throw HttpError.notFound("User not found");
		}

		// INFO: can't delete admins
		if (user.role === "admin") {
			throw HttpError.badRequest("Bad request");
		}

		await userModel.deleteOne({ _id: user._id });

		return reply.status(200).send({
			message: "User deleted successfully",
		});
	}

	async a_updateUserInfoHandler(
		req: FastifyRequest<{
			Params: { id: string };
			Body: AdminUpdateUserInput;
		}>,
		reply: FastifyReply,
	) {
		const { id } = req.params;

		const { name, email, role } = req.body;

		const user = await userModel.findById(id);

		// INFO: shouldn't happen for the web-app's interface
		if (!user) {
			throw HttpError.notFound("User not found");
		}

		if (name !== undefined) user.name = name;
		if (email !== undefined) user.email = email;
		if (role !== undefined) user.role = role;

		const updatedUser = await user.save();

		return reply.status(200).send({
			message: "User updated successfully",
			user: {
				_id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email,
				role: updatedUser.role,
			},
		});
	}
}

export default User;
