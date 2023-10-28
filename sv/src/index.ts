import express from "express";
import { config } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
config();

const PORT = process.env.PORT ?? 42069;
const app = express();

app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.get("/check", (_req, res) => res.sendStatus(200));

app.listen(PORT, () => console.log("YEP"));
