import { products, users } from "./initialData.js";
import { MongoClient } from "mongodb";
import { hashPassword } from "./src/utils/hash.js";

type User = (typeof users)[0];
type Product = (typeof products)[0];

const uri = "mongodb://mongo:mongo@localhost:27017/";
const client = new MongoClient(uri);

async function seedDB() {
	// Connection URL
	await client.connect().catch((e) => console.error(e));
	console.log("Connected correctly to server");

	const userCollection = client.db("ecom").collection("users");
	const productCollection = client.db("ecom").collection("products");

	// The drop() command destroys all data from a collection.
	// Make sure you run it against proper database and collection.
	userCollection.drop();
	productCollection.drop();

	const userArr: Array<User> = [];
	const product: Array<Product> = [];
	const password = await hashPassword("123456");

	for (const u of users) {
		const user: User = {
			name: u.name,
			password,
			email: u.email,
			role: u.role,
		};
		userArr.push(user);
	}

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
		product.push(pro);
	}

	await userCollection.insertMany(userArr).catch((e) => console.error(e));
	await userCollection.findOne().then(console.log);
	await productCollection.insertMany(product).catch((e) => console.log(e));
	await productCollection.findOne().then(console.log);

	return "Database seeded";
}

seedDB()
	.then(console.log)
	.catch(console.error)
	.finally(() => client.close());
