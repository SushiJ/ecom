import { products, users } from "./initialData.js";
import { MongoClient } from "mongodb";
import { hashPassword } from "./src/utils/hash.js";
import { argv } from "process";

if (argv.length > 3 || argv.length < 3) {
	console.log("USAGE: tsx seed.ts [db_name]");
	process.exit(1);
}

const db_name = argv[2];

type User = (typeof users)[0];
type Product = (typeof products)[0];

const uri = "mongodb://mongo:mongo@localhost:27017/";
const client = new MongoClient(uri);

const userArr: Array<User> = [];
const product: Array<Product> = [];

async function seedDB() {
	const password = await hashPassword("123456");
	await client.connect().catch((e) => console.error(e));
	console.log("Connected correctly to server");

	const userCollection = client.db(db_name).collection("users");
	const productCollection = client.db(db_name).collection("products");

	// The drop() command destroys all data from a collection.
	// Make sure you run it against proper database and collection.
	userCollection.drop();
	productCollection.drop();

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
