import express from "express";
import { config } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
config();

import { products } from "./initialData";

const PORT = process.env.PORT ?? 42069;
const app = express();

app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/check", (_req, res) => res.sendStatus(200));
app.get("/api/products", (_req, res) => res.json(products));

app.listen(PORT, () => console.log("YEP"));
