import {
	getModelForClass,
	prop,
	modelOptions,
	DocumentType,
	pre,
} from "@typegoose/typegoose";
import { comparePassword, hashPassword } from "../utils/hash";

@pre<User>("save", async function () {
	if (!this.isModified("password")) {
		return;
	}

	const hashedPassword = await hashPassword(this.password);
	this.password = hashedPassword;
})
@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
	@prop({ required: true })
	public name!: string;

	@prop({ required: true, unique: true })
	public email!: string;

	@prop({ required: true })
	public password!: string;

	@prop({ required: true, default: "user" })
	public role!: string;

	public async passwordMatch(this: DocumentType<User>, password: string) {
		return await comparePassword(password, this.password);
	}
}

const userModel = getModelForClass(User);

export default userModel;
