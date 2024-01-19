import {
  getModelForClass,
  prop,
  modelOptions,
  DocumentType,
} from "@typegoose/typegoose";
import { matchPassword } from "../utils/pass";

@modelOptions({ schemaOptions: { timestamps: true } })
class User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true, default: false })
  public isAdmin!: boolean;

  public async matchPassword(this: DocumentType<User>, password: string) {
    return matchPassword(this.password, password);
  }
}

const userModel = getModelForClass(User);

export default userModel;
