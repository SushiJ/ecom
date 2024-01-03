import {} from "crypto";
import {
  getModelForClass,
  prop,
  modelOptions,
  Ref,
} from "@typegoose/typegoose";
import User from "../controllers/user";
import Product from "../controllers/products";

class OrderItems {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public qty!: number;

  @prop({ required: true })
  public image!: string;

  @prop({ required: true })
  public price!: number;

  @prop({ required: true, ref: () => Product })
  public product!: Ref<Product>;
}

class ShippingAddress {
  @prop({ required: true })
  public address!: string;

  @prop({ required: true })
  public city!: string;

  @prop({ required: true })
  public postalCode!: string;

  @prop({ required: true })
  public country!: string;
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
    id: { type: string };
    status: { type: string };
    update_time: { type: string };
    email_address: { type: string };
  };

  @prop({ required: true, default: 0 })
  public itemsPrice!: number;

  @prop({ required: true, default: 0 })
  public taxPrice!: number;

  @prop({ required: true, default: 0 })
  public shippingPrice!: number;

  @prop({ required: true, default: 0 })
  public totalPrice!: number;

  @prop({ required: true, default: false })
  public isPaid!: boolean;

  @prop({ required: false })
  public paidAt?: Date;

  @prop({ required: true, default: false })
  public isDelivered!: boolean;

  @prop({ required: false })
  public deliveredAt?: Date;
}

const orderModel = getModelForClass(Order);

export default orderModel;
