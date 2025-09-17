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
	{
		name: "Cannon EOS 80D DSLR Camera",
		image: "/images/camera.jpg",
		description:
			"Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design",
		brand: "Cannon",
		category: "Electronics",
		price: 929.99,
		countInStock: 5,
		rating: 3,
		numReviews: 12,
	},
	{
		name: "Sony Playstation 5",
		image: "/images/playstation.jpg",
		description:
			"The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music",
		brand: "Sony",
		category: "Electronics",
		price: 399.99,
		countInStock: 11,
		rating: 5,
		numReviews: 12,
	},
	{
		name: "Logitech G-Series Gaming Mouse",
		image: "/images/mouse.jpg",
		description:
			"Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience",
		brand: "Logitech",
		category: "Electronics",
		price: 49.99,
		countInStock: 7,
		rating: 3.5,
		numReviews: 10,
	},
	{
		name: "Amazon Echo Dot 3rd Generation",
		image: "/images/alexa.jpg",
		description:
			"Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small space",
		brand: "Amazon",
		category: "Electronics",
		price: 29.99,
		countInStock: 0,
		rating: 4,
		numReviews: 12,
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
		name: "John Doe",
		email: "john@email.com",
		password: "",
		role: "user",
	},
	{
		name: "Jane Doe",
		email: "jane@email.com",
		password: "",
		role: "user",
	},
];

export default users;
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
	public async insertProducts() {
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

	public async insertUsers() {
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
	public async dropDatabase(key: "PRODUCTS" | "USERS") {
		if (key === "PRODUCTS") {
			await productModel.deleteMany();
		}
		if (key === "USERS") {
			await userModel.deleteMany();
		}
	}
}
