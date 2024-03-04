import type { FastifyReply, FastifyRequest } from "fastify";
import { productModel } from "../models/Product";

//TODO: migrate the prices to INR
class Product {
  async getProducts(_req: FastifyRequest, reply: FastifyReply) {
    const products = await productModel.find();
    if (!products) reply.status(200).send([]);
    reply.status(200).send(products);
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
      // May be a 204 ? But 400 suits better ( bad request )
      reply.status(400);
      throw new Error("No product with that id");
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

    const createdProduct = await product.save();
    return reply.status(201).send(createdProduct);
  }

  async updateProduct(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };

    const product = await productModel.findById(id);

    if (!product) {
      reply.status(404);
      throw new Error("Not found");
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

  async deleteProduct(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };

    const product = await productModel.findById(id);

    if (!product) {
      reply.status(404);
      throw new Error("Product not found");
    }

    await productModel.deleteOne({ _id: product._id });

    return reply.status(200).send("Resource deleted successfully");
  }

  async getTopProducts(_: FastifyRequest, reply: FastifyReply) {
    const products = await productModel.find().sort({ rating: -1 }).limit(3);
    reply.status(200).send(products);
  }
}

export default Product;
