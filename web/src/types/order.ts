export type OrderCreateResponse = {
	user: {
		_id: string;
		name: string;
		email: string;
		isAdmin: boolean;
	};
	orderItems: [
		{
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
			__v: number;
			quantity: number;
		},
	];
	shippingAddress: {
		address: string;
		city: string;
		postalCode: string;
		country: string;
	};
	paymentMethod: string;
	paymentResult: boolean;
	productsPrice: number;
	taxPrice: number;
	shippingPrice: number;
	totalAmount: number;
	isPaid: boolean;
	paidAt?: Date;
	isDelivered: boolean;
	deliveredAt?: Date;
	_id: string;
	createdAt: string;
	updatedAt: string;
	__v: 0;
};

export type GetOrdersResponse = Omit<OrderCreateResponse, "user"> & {
	user: string;
};

export type GetAllOrdersResponse = {
	_id: string;
	user: {
		_id: string;
		name: string;
	};
	orderItems: [
		{
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
			quantity: number;
		},
	];
	shippingAddress: {
		address: "test";
		city: "test";
		postalCode: "test";
		country: "test";
	};
	paymentMethod: string;
	paymentResult: boolean;
	productsPrice: number;
	taxPrice: number;
	shippingPrice: number;
	totalAmount: number;
	isPaid: boolean;
	paidAt?: Date;
	isDelivered: boolean;
	deliveredAt?: Date;
	createdAt: Date;
	updatedAt: Date;
};
