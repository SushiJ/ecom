import mongoose from "mongoose";

const MONGO_URL = "mongodb://mongo:mongo@127.0.0.1:27017/";

export default async function connect() {
  mongoose.connect(MONGO_URL, {
    dbName: "ecom",
  });
}
