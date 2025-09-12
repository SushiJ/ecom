import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

class ReviewUser {
	@prop({ required: true })
	public _id!: string;

	@prop({ required: true })
	public name!: string;

	@prop({ required: true })
	public email!: string;
}

@modelOptions({ schemaOptions: { timestamps: true } })
class Reviews {
	@prop({ required: true })
	public rating!: number;

	@prop({ required: true })
	public comment!: string;

	@prop({ required: true })
	public user!: ReviewUser;
}

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
	public price!: number;

	@prop({ required: true })
	public countInStock!: number;

	@prop({ required: true })
	public rating!: number;

	@prop({ required: true })
	public numReviews!: number;

	@prop({ type: () => [Reviews] })
	public reviews!: Array<Reviews>;
}

export const productModel = getModelForClass(Product);
