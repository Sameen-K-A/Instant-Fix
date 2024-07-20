const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const user_routes = require("./routes/user_routes");
const technician_routes = require("./routes/technician_routes");
const admin_routes = require("./routes/admin_routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/", user_routes);
app.use("/technician", technician_routes);
app.use("/admin", admin_routes);

app.listen(3000, console.log("Server is started"));