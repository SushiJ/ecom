import { type FastifyReply, type FastifyRequest } from "fastify";
import { productModel } from "../models/Product";
import { HttpError } from "../utils/HttpErrors";

//TODO: migrate the prices to INR
class Product {
	async getProducts(
		req: FastifyRequest<{
			Querystring: {
				pageNum?: string;
				keyword?: string;
			};
		}>,
		reply: FastifyReply,
	) {
		const page = Number(req.query.pageNum) || 1;
		const keyword = req.query.keyword;
		let query = {};

		if (keyword) {
			query = { name: { $regex: keyword, $options: "i" } };
		}

		const pageSize = 4;
		const count = await productModel.countDocuments(query);

		const products = await productModel
			.find(query)
			.limit(pageSize)
			.skip(pageSize * (page - 1));
		if (!products) reply.status(200).send([]);

		reply
			.status(200)
			.send({ products, page, pages: Math.ceil(count / pageSize) });
	}

	async getProductsById(
		req: FastifyRequest<{
			Params: {
				id: string;
			};
		}>,
		reply: FastifyReply,
	) {
		const { id } = req.params;
		// NOTE: May be {status, message} would be a better API? IDK
		const product = await productModel.findById(id);

		if (!product) {
			throw HttpError.notFound("Product not found");
		}

		return reply.status(200).send(product);
	}

	async createProducts(req: FastifyRequest, reply: FastifyReply) {
		const { id } = req.user as { id: string };

		const product = new productModel({
			name: "Sample name",
			price: 0,
			user: id,
			image: "/images/sample.jpg",
			brand: "Sample brand",
			category: "Sample category",
			countInStock: 0,
			numReviews: 0,
			description: "Sample description",
			rating: 0,
		});

		let productCreated;

		try {
			productCreated = await product.save();
		} catch (e) {
			console.error("Something went wrong while saving the product", e);
			throw HttpError.internalServerError("something went wrong");
		}

		reply.code(201);
		reply.send(productCreated);
		return reply;
	}

	async updateProduct(
		req: FastifyRequest<{
			Params: {
				id: string;
			};
		}>,
		reply: FastifyReply,
	) {
		const { id } = req.params;

		const product = await productModel.findById(id);

		if (!product) {
			throw HttpError.notFound("Not found");
		}

		const data = req.body as {
			name: string;
			price: number;
			description: string;
			image: string;
			brand: string;
			category: string;
			countInStock: number;
		};

		product.price = data.price;
		product.name = data.name;
		product.description = data.description;
		product.image = data.image;
		product.brand = data.brand;
		product.category = data.category;
		product.countInStock = data.countInStock;

		const updated = await product.save();

		return reply.status(200).send(updated);
	}

	async deleteProduct(
		req: FastifyRequest<{
			Params: {
				id: string;
			};
		}>,
		reply: FastifyReply,
	) {
		const { id } = req.params;

		const product = await productModel.findById(id);

		if (!product) {
			throw HttpError.notFound("Product not found");
		}

		await productModel.deleteOne({ _id: product._id });

		return reply.status(200).send("Resource deleted successfully");
	}

	async createProductReview(
		req: FastifyRequest<{
			Params: {
				id: string;
			};
		}>,
		reply: FastifyReply,
	) {
		const { id } = req.params;

		const { rating, comment } = req.body as { rating: number; comment: string };

		const product = await productModel.findById(id);

		if (!product) {
			throw HttpError.notFound("Product not found");
		}

		const user = req.user as { _id: string; name: string; email: string };

		const alreadyReviewed = product.reviews.find((review) => {
			return review.user._id.toString() === user._id.toString();
		});

		if (alreadyReviewed) {
			throw HttpError.badRequest("Already reviewed");
		}

		const review = {
			rating: rating,
			comment: comment,
			user: user,
		};

		product.reviews = [...product.reviews, review];

		product.numReviews = product.reviews.length;

		let totalRating = 0;
		for (let i = 0; i < product.reviews.length; i++) {
			totalRating += product.reviews[i]!.rating;
		}

		product.rating = totalRating / product.reviews.length;

		await product.save();
		return reply.status(201).send("Review added");
	}

	async getTopProducts(_: FastifyRequest, reply: FastifyReply) {
		const products = await productModel.find().sort({ rating: -1 }).limit(3);
		reply.status(200).send(products);
	}
}

export default Product;
