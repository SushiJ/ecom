import type { FastifyReply, FastifyRequest } from "fastify";
import { productModel } from "../models/Product";

export async function getProducts(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const products = await productModel.find();
    if (!products) reply.status(200).send([]);
    reply.status(200).send(products);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    reply.status(500).send();
  }
}

export async function getProductsById(
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
      reply.status(404).send("Not found");
      return;
    }
    reply.status(200).send(product);
  } catch (e) {
    console.log(e);
    reply.status(500).send("Internal server Error");
  }
}
