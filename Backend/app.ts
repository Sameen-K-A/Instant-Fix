import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import user_routes from "./routes/user_routes";
import admin_routes from "./routes/admin_routes";
import technician_routes from "./routes/technician_routes";
import DB_Connection from "./Config/DB_config";

dotenv.config();
DB_Connection();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());
app.use("/admin", admin_routes);
app.use("/technician", technician_routes);
app.use("/", user_routes);

app.listen(3000, (): void => {
   console.log("Server is started");
});
