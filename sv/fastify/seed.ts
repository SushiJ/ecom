import { productModel } from "./src/models/Product";
import connect from "./src/utils/connection";
import { products } from "./initialData";

type Product = Omit<(typeof products)[0], "_id">;

async function saveProduct(product: Product) {
  productModel
    .insertMany(product)
    .then(() => console.log("Document saved successfully"))
    .catch((err) => console.error("Error saving document:", err));
}

async function populateProduct() {
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
    await saveProduct(product);
  }
}

function main() {
  connect()
    .then(() => {
      console.log("CONNECTED");
      populateProduct().catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));
}

main();
