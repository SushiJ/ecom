import type { FastifyReply, FastifyRequest } from "fastify";
import { orderModel } from "../models/Order";

class Order {
  async addOrderItems(request: FastifyRequest, reply: FastifyReply) {
    // TODO: seek better type, body as {} ???
    const { orderItems, shippingAddress, paymentMethod } = request.body as {
      orderItems: Array<string>;
      shippingAddress: string;
      paymentMethod: string;
    };

    if (
      !orderItems ||
      orderItems.length === 0 ||
      !shippingAddress ||
      !paymentMethod
    ) {
      reply.status(400);
      throw new Error("No order items");
    }

    reply.status(200).send({
      orderItems,
      shippingAddress,
      paymentMethod,
    });
  }
  // get the ordered items from our database
  // const itemsFromDB = await productModel.find({
  //   _id: { $in: orderItems.map((x) => x._id) },
  // });
  //
  // // map over the order items and use the price from our items from database
  // const dbOrderItems = orderItems.map((itemFromClient) => {
  //   const matchingItemFromDB = itemsFromDB.find(
  //     (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id,
  //   );
  //   return {
  //     ...itemFromClient,
  //     product: itemFromClient._id,
  //     price: matchingItemFromDB.price,
  //     _id: undefined,
  //   };
  // });

  // calculate prices
  // const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
  //   calcPrices(dbOrderItems);
  //
  // const order = new Order({
  //   orderItems: dbOrderItems,
  //   user: req.user._id,
  //   shippingAddress,
  //   paymentMethod,
  //   itemsPrice,
  //   taxPrice,
  //   shippingPrice,
  //   totalPrice,
  // });
  //
  // const createdOrder = await order.save();
  //
  // reply.status(201).send(createdOrder);

  async getMyOrders(req: FastifyRequest, reply: FastifyReply) {
    const orders = await orderModel.find({ user: req.user._id });
    reply.send(orders);
  }

  async getOrderById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as {
      id: string;
    };
    try {
      const order = await orderModel
        .findById(id)
        .populate("user", "name email");

      if (!order) {
        // INFO: could be a 400? Not sure
        reply.status(204).send("No order with that id");
        return;
      }
      reply.status(200).send(order);
    } catch (e) {
      console.log(e);
      reply.status(500).send("Internal server Error");
    }
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

    reply.status(200).send(updatedOrder);
  }

  async getOrders(_req: FastifyRequest, reply: FastifyReply) {
    try {
      const orders = await orderModel.find().populate("user", "id", "nam");
      if (!orders) reply.status(200).send([]);
      reply.status(200).send(orders);
    } catch (e) {
      reply.status(500).send("Internal server Error");
    }
  }
}

export default Order;

// // @desc    Update order to paid
// // @route   PUT /api/orders/:id/pay
// // @access  Private
// const updateOrderToPaid = asyncHandler(async (req, res) => {
//   // NOTE: here we need to verify the payment was made to PayPal before marking
//   // the order as paid
//   const { verified, value } = await verifyPayPalPayment(req.body.id);
//   if (!verified) throw new Error('Payment not verified');
//
//   // check if this transaction has been used before
//   const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
//   if (!isNewTransaction) throw new Error('Transaction has been used before');
//
//   const order = await Order.findById(req.params.id);
//
//   if (order) {
//     // check the correct amount was paid
//     const paidCorrectAmount = order.totalPrice.toString() === value;
//     if (!paidCorrectAmount) throw new Error('Incorrect amount paid');
//
//     order.isPaid = true;
//     order.paidAt = Date.now();
//     order.paymentResult = {
//       id: req.body.id,
//       status: req.body.status,
//       update_time: req.body.update_time,
//       email_address: req.body.payer.email_address,
//     };
//
//     const updatedOrder = await order.save();
//
//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error('Order not found');
//   }
// });
