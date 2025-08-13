import { z } from "zod";

// Product schema
const ProductSchema = z.object({
	_id: z.string().min(1, "Product ID is required"),
	name: z.string().min(1, "Product name is required"),
	image: z.url("Image must be a valid URL"),
	description: z.string().min(1, "Description is required"),
	brand: z.string().min(1, "Brand is required"),
	category: z.string().min(1, "Category is required"),
	price: z.number().positive("Price must be positive"),
	countInStock: z.number().int().min(0, "Count in stock must be non-negative"),
	rating: z.number().min(0).max(5, "Rating must be between 0 and 5"),
	numReviews: z.number().int().min(0, "Number of reviews must be non-negative"),
});

// Ordered products schema
const OrderedProductsSchema = z
	.array(
		z.object({
			product: ProductSchema,
			quantity: z
				.number()
				.int()
				.positive("Quantity must be a positive integer"),
		}),
	)
	.min(1, "At least one product must be ordered");

// Complete request body schema
export const AddOrderItemsSchema = z.object({
	orderedProducts: OrderedProductsSchema,
	shippingAddress: z.string().min(1, "Shipping address is required"),
	paymentMethod: z.string().min(1, "Payment method is required"),
});

// Type inference from the schema
export type AddOrderItemsRequestBody = z.infer<typeof AddOrderItemsSchema>;

// Payment update schema
export const PaymentUpdateSchema = {
	params: z.object({
		id: z.string().min(1, "Order ID is required"),
	}),
	body: z.object({
		id: z.string().min(1, "Payment ID is required"),
		status: z.string(),
		update_time: z.coerce.date(), // Converts string to Date
		email_address: z.email("Must be a valid email address"),
	}),
};

// Type inference
export type PaymentUpdateRequest = {
	Params: z.infer<typeof PaymentUpdateSchema.params>;
	Body: z.infer<typeof PaymentUpdateSchema.body>;
};

// Alternative if you want more flexible status validation
export const PaymentUpdateSchemaFlexible = {
	params: z.object({
		id: z.string().min(1, "Order ID is required"),
	}),
	body: z.object({
		id: z.string().min(1, "Payment ID is required"),
		status: z.string().min(1, "Status is required"),
		update_time: z.union([
			z
				.string()
				.transform((str) => new Date(str)), // Handle string dates
			z.date(), // Handle Date objects
		]),
		email_address: z.email("Must be a valid email address"),
	}),
};

// If you need to handle different payment providers
export const PaymentUpdateSchemaWithProvider = {
	params: z.object({
		id: z.string().min(1, "Order ID is required"),
	}),
	body: z.object({
		id: z.string().min(1, "Payment ID is required"),
		status: z.string().min(1, "Status is required"),
		update_time: z.coerce.date(),
		email_address: z.email("Must be a valid email address"),
	}),
};

// Usage in your Fastify handler
// async function addOrderItems(request: FastifyRequest, reply: FastifyReply) {
//   try {
//     // Validate the request body
//     const validatedBody = AddOrderItemsSchema.parse(request.body);
//
//     const { orderedProducts, shippingAddress, paymentMethod } = validatedBody;
//
//     // Rest of your existing logic...
//     const orderedProductsFromDB = await productModel.find({
//       _id: { $in: orderedProducts.map(({ product }) => product._id) },
//     });
//
//     // ... continue with your existing implementation
//
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       reply.status(400).send({
//         error: "Validation failed",
//         details: error.errors
//       });
//       return;
//     }
//     throw error;
//   }
// }
