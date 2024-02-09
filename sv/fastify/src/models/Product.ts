import { getModelForClass, prop } from "@typegoose/typegoose";

export class Product {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public image!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true })
  public brand!: string;

  @prop({ required: true })
  public category!: string;

  @prop({ required: true })
  public price!: string;

  @prop({ required: true })
  public countInStock!: number;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true })
  public numReviews!: number;
}

export const productModel = getModelForClass(Product);
