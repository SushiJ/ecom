import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";

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
}

const userModel = getModelForClass(User);

export default userModel;
