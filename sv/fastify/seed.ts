import { products, users } from "./initialData.js";
import { MongoClient } from "mongodb";

type Product = Omit<(typeof products)[0], "_id">;

type User = (typeof users)[0];

async function _seedProducts() {
  const productsArr: Array<Product> = [];
  for (const productData of products) {
    const product: Product = {
      name: productData["name"],
      image: productData["image"],
      price: productData["price"],
      brand: productData["brand"],
      rating: productData["rating"],
      category: productData["category"],
      description: productData["description"],
      countInStock: productData["countInStock"],
      numReviews: productData["numReviews"],
    };
    productsArr.push(product);
  }
}

const uri = "mongodb://mongo:mongo@localhost:27017/";
const client = new MongoClient(uri);

async function seedDB() {
  // Connection URL
  await client.connect().catch((e) => console.error(e));
  console.log("Connected correctly to server");

  const collection = client.db("ecom").collection("users");

  // The drop() command destroys all data from a collection.
  // Make sure you run it against proper database and collection.
  collection.drop();

  const userArr: Array<User> = [];

  for (const u of users) {
    const user: User = {
      name: u["name"],
      password: u["password"],
      email: u["email"],
      isAdmin: u["isAdmin"],
    };
    userArr.push(user);
  }
  await collection.insertMany(userArr).catch((e) => console.error(e));
  await collection.findOne().then(console.log);
  return "Database seeded";
}

seedDB()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
