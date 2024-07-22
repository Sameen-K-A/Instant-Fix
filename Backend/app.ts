import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import user_routes from "./routes/user_routes";
import DB_Connection from "./Database/DB_config";

const app: Application = express();
dotenv.config();
DB_Connection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/", user_routes);

app.listen(3000, (): void => {
   console.log("Server is started");
});