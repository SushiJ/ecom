import { users } from "./initialData.js";
import { MongoClient } from "mongodb";

type User = (typeof users)[0];

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
      name: u.name,
      password: u.password,
      email: u.email,
      isAdmin: u.isAdmin,
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
