import type { FastifyReply, FastifyRequest } from "fastify";
import { productModel } from "../models/Product";

class Product {
  async getProducts(_req: FastifyRequest, reply: FastifyReply) {
    try {
      const products = await productModel.find();
      if (!products) reply.status(200).send([]);
      reply.status(200).send(products);
    } catch (e) {
      reply.status(500).send("Internal server Error");
    }
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
    try {
      // NOTE: May be {status, message} would be a better API? IDK
      const product = await productModel.findById(id);
      if (!product) {
        // May be a 204 ? But 400 suits better ( bad request )
        reply.status(400).send("No product with that id");
        return;
      }
      reply.status(200).send(product);
    } catch (e) {
      console.log(e);
      reply.status(500).send("Internal server Error");
    }
  }
}

export default Product;
