import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookie_parser from "cookie-parser"
import user_routes from './Routes/user_routes';
import admin_routes from './Routes/admin_routes';
import technician_routes from './Routes/technician_routes';
import chat_routes from "./Routes/chat_routes";
import DB_Connection from "./Config/database_config";
import { configSocketIO } from './Config/socket_config';
import { createServer } from "http";
import passport from "./Config/passport_config";
import morgan from "morgan";

dotenv.config();

const app: Application = express();
const server = createServer(app);

DB_Connection();
configSocketIO(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookie_parser());
app.use(passport.initialize());
app.use(morgan('dev'));
app.use(cors({
   origin: "http://localhost:5173",
   credentials: true
}));
app.use('/admin', admin_routes);
app.use('/technician', technician_routes);
app.use('/chat', chat_routes);
app.use('/', user_routes);

server.listen(process.env.PORT, (): void => {
   console.log(`Server is started on port ${process.env.PORT}`);
});