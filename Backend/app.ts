import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import user_routes from './routes/user_routes';
import admin_routes from './routes/admin_routes';
import technician_routes from './routes/technician_routes';
import chat_routes from "./routes/chat_routes";
import DB_Connection from './Config/DB_config';
import { configSocketIO } from './Config/Socket_config';
import { createServer } from "http";

dotenv.config();

const app: Application = express();
const server = createServer(app);

DB_Connection();
configSocketIO(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());
app.use('/admin', admin_routes);
app.use('/technician', technician_routes);
app.use('/chat', chat_routes);
app.use('/', user_routes);

server.listen(process.env.PORT, (): void => {
   console.log(`Server is started on port ${process.env.PORT}`);
});