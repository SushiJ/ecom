import type { FastifyReply, FastifyRequest } from "fastify";
import { orderModel } from "../models/Order";
import { productModel } from "../models/Product";

type Product = {
  _id: string;
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
};

type OrderedProducts = Array<{
  product: Product;
  quantity: number;
}>;

interface IProduct extends Product {
  quantity: number;
}

class Order {
  static toFixedDecimal(item: number) {
    return (Math.round(item * 100) / 100).toFixed(2);
  }

  static calcPrices(products: Array<IProduct>) {
    // Calculate the items price in whole number (pennies) to avoid issues with
    // floating point number calculations
    let productPrice: number = 0;
    products.map(({ price, quantity }) => (productPrice += price * quantity));

    // Calculate the shipping price
    const shippingPrice = productPrice > 100 ? 0 : 10;

    // Calculate the tax price
    const taxPrice = 0.15 * productPrice;

    // Calculate the total price
    const totalAmount = productPrice + shippingPrice + taxPrice;

    // return prices as strings fixed to 2 decimal places
    return {
      productsPrice: Order.toFixedDecimal(productPrice),
      shippingPrice: Order.toFixedDecimal(shippingPrice),
      taxPrice: Order.toFixedDecimal(taxPrice),
      totalAmount: Order.toFixedDecimal(totalAmount),
    };
  }

  async addOrderItems(request: FastifyRequest, reply: FastifyReply) {
    // TODO: seek better type, body as {} ???
    const { orderedProducts, shippingAddress, paymentMethod } =
      request.body as {
        orderedProducts: OrderedProducts;
        shippingAddress: string;
        paymentMethod: string;
      };

    if (
      !orderedProducts ||
      orderedProducts.length === 0 ||
      !shippingAddress ||
      !paymentMethod
    ) {
      reply.status(400);
      throw new Error("No order items");
    }

    // get the ordered items from our database
    const orderedProductsFromDB = await productModel.find({
      _id: { $in: orderedProducts.map(({ product }) => product._id) },
    });

    // map over the order items and use the price from our items from database
    const priceCorrectedProducts = orderedProducts.map(
      ({ product, quantity }) => {
        const matchingProductFromDB = orderedProductsFromDB.find(
          (itemFromDB) => itemFromDB._id.toString() === product._id,
        );
        const sanitisedProduct = {
          ...product,
          price: Number(matchingProductFromDB?.price),
        };
        return {
          ...sanitisedProduct,
          quantity,
        };
      },
    );

    const { productsPrice, taxPrice, shippingPrice, totalAmount } =
      Order.calcPrices(priceCorrectedProducts);

    const user = request.user as {
      _id: string;
      email: string;
      name: string;
    };

    const createdOrder = new orderModel({
      orderItems: priceCorrectedProducts,
      user,
      shippingAddress,
      paymentMethod,
      productsPrice,
      taxPrice,
      shippingPrice,
      totalAmount,
      paymentResult: false,
    });

    const created = await createdOrder.save();

    return reply.status(201).send(created);
  }

  async getMyOrders(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user as {
      _id: string;
    };
    const orders = await orderModel.find({ user: user._id });

    return reply.status(200).send(orders);
  }

  async getOrderById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as {
      id: string;
    };
    let order = await orderModel.findById(id);

    if (!order) {
      // INFO: could be a 400? Not sure
      return reply.status(204).send("No order with that id");
    }
    order = await order.populate("user", "name email");
    return reply.status(200).send(order);
  }

  // INFO: ADMIN ROUTES

  async updateOrderToDelivered(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };

    const order = await orderModel.findById(id);

    if (!order) {
      reply.status(204);
      throw new Error("Order not found");
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();

    return reply.status(200).send(updatedOrder);
  }

  async getOrders(_req: FastifyRequest, reply: FastifyReply) {
    const orders = await orderModel.find().populate("user", "id name");

    if (!orders) reply.status(200).send([]);

    return reply.status(200).send(orders);
  }

  async updateOrderToPaid(req: FastifyRequest, res: FastifyReply) {
    // NOTE: here we need to verify the payment was made to PayPal before marking
    // the order as paid
    // const { verified, value } = await verifyPayPalPayment(req.body.id);
    // if (!verified) throw new Error("Payment not verified");
    //
    // check if this transaction has been used before
    // const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
    // if (!isNewTransaction) throw new Error("Transaction has been used before");

    const { id: orderId } = req.params as { id: string };
    const order = await orderModel.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    // check the correct amount was paid
    // const paidCorrectAmount = order.totalAmount.toString() === value;
    // if (!paidCorrectAmount) throw new Error("Incorrect amount paid");

    const { id, status, update_time, email_address } = req.body as {
      id: string;
      status: string;
      update_time: Date;
      email_address: string;
    };

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id,
      status,
      update_time,
      email_address,
    };

    const updatedOrder = await order.save();

    return res.status(200).send(updatedOrder);
  }
}

export default Order;
