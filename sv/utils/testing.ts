import { connectTestDb, disconnectTestDatabase } from "../src/utils/connection";
import { productModel } from "../src/models/Product";
import { hashPassword } from "../src/utils/hash";
import userModel from "../src/models/User";

const products = [
	{
		name: "Airpods Wireless Bluetooth Headphones",
		image: "/images/airpods.jpg",
		description:
			"Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working",
		brand: "Apple",
		category: "Electronics",
		price: 89.99,
		countInStock: 10,
		rating: 4.5,
		numReviews: 12,
	},
	{
		name: "iPhone 13 Pro 256GB Memory",
		image: "/images/phone.jpg",
		description:
			"Introducing the iPhone 13 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life",
		brand: "Apple",
		category: "Electronics",
		price: 599.99,
		countInStock: 7,
		rating: 4.0,
		numReviews: 8,
	},
];

const users = [
	{
		name: "Admin User",
		email: "admin@email.com",
		password: "",
		role: "admin",
	},
	{
		name: "Jane Doe",
		email: "jane@email.com",
		password: "",
		role: "user",
	},
];

type User = (typeof users)[0];
type Product = (typeof products)[0];

export class Database {
	private userArr: Array<User> = [];
	private products: Array<Product> = [];

	public async connectToDatabase() {
		await connectTestDb();
	}

	public async disconnect() {
		await disconnectTestDatabase();
	}

	public async setupProducts() {
		for (const p of products) {
			const pro: Product = {
				name: p.name,
				price: p.price,
				brand: p.brand,
				image: p.image,
				rating: p.rating,
				category: p.category,
				numReviews: p.numReviews,
				description: p.description,
				countInStock: p.countInStock,
			};
			this.products.push(pro);
		}
		await productModel.insertMany(this.products);
	}
	public async setupProduct() {
		return await new productModel(products[0]).save();
	}

	public async setupUsers() {
		const password = await hashPassword("123456");
		for (const u of users) {
			const user: User = {
				name: u.name,
				password,
				email: u.email,
				role: u.role,
			};
			this.userArr.push(user);
		}
		await userModel.insertMany(this.products);
	}
	public async setupUser(role: "admin" | "user") {
		let user: User;
		if (role === "admin") {
			user = users[0]!;
			user.password = "123456";
		} else {
			user = users[1]!;
			user.password = "123456";
		}
		return await new userModel(user).save();
	}

	public async dropDatabase(key: "PRODUCTS" | "USERS") {
		if (key === "PRODUCTS") {
			await productModel.deleteMany();
		}
		if (key === "USERS") {
			await userModel.deleteMany();
		}
	}
}

export function extractJwtFromSetCookie(setCookieHeader: any): string {
	const raw = setCookieHeader[0]; // grab first cookie
	return raw.split(";")[0].split("=")[1]; // get value after citrus=
}
