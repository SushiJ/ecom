import {
	getModelForClass,
	prop,
	modelOptions,
	DocumentType,
	pre,
} from "@typegoose/typegoose";
import { matchPassword, setPassword } from "../utils/pass";

@pre<User>("save", async function () {
	if (!this.isModified("password")) {
		return;
	}

	const hash = setPassword(this.password);

	this.password = hash;

	return;
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

	public passwordMatch(this: DocumentType<User>, password: string) {
		const bool = matchPassword(this.password, password);
		return bool;
	}
}

const userModel = getModelForClass(User);

export default userModel;
