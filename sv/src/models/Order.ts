import { } from "crypto";
import {
  getModelForClass,
  prop,
  modelOptions,
  Ref,
} from "@typegoose/typegoose";
import { User } from "./User";
import { Product } from "./Product";

class OrderItems {
  @prop({ required: true })
  public quantity!: number;

  @prop({ required: true, ref: () => Product })
  public product!: Ref<Product>;
}

@modelOptions({ schemaOptions: { _id: false } })
class ShippingAddress {
  @prop({ required: true })
  public address!: string;

  @prop({ required: true })
  public city!: string;

  @prop({ required: true })
  public postalCode!: string;
}

@modelOptions({ schemaOptions: { timestamps: true } })
class Order {
  @prop({ required: true, ref: () => User })
  public user!: Ref<User>;

  @prop({ required: true })
  public orderItems!: Array<OrderItems>;

  @prop({ required: false })
  public shippingAddress?: ShippingAddress;

  @prop({ required: true })
  public paymentMethod!: string;

  @prop({ required: true })
  public paymentResult!: {
    id: string;
    status: string;
    update_time: Date;
    email_address: string;
  };

  @prop({ required: true, default: 0 })
  public productsPrice!: number;

  @prop({ required: true, default: 0 })
  public taxPrice!: number;

  @prop({ required: true, default: 0 })
  public shippingPrice!: number;

  @prop({ required: true, default: 0 })
  public totalAmount!: number;

  @prop({ required: true, default: false })
  public isPaid!: boolean;

  @prop({ required: false })
  public paidAt?: Date;

  @prop({ required: true, default: false })
  public isDelivered!: boolean;

  @prop({ required: false })
  public deliveredAt?: Date;
}

export const orderModel = getModelForClass(Order);
