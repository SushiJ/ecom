import mongoose from "mongoose";

const MONGO_URL = "mongodb://mongo:27017/";

export default async function connect() {
  return mongoose.connect(MONGO_URL, {
    dbName: "ecom",
    pass: "mongo",
    user: "mongo",
  });
}
