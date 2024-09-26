"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = __importDefault(require("./Routes/user_routes"));
const admin_routes_1 = __importDefault(require("./Routes/admin_routes"));
const technician_routes_1 = __importDefault(require("./Routes/technician_routes"));
const chat_routes_1 = __importDefault(require("./Routes/chat_routes"));
const database_config_1 = __importDefault(require("./Config/database_config"));
const socket_config_1 = require("./Config/socket_config");
const http_1 = require("http");
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
(0, database_config_1.default)();
(0, socket_config_1.configSocketIO)(server);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", 'https://instant-fix.vercel.app'],
    credentials: true
}));
app.use('/admin', admin_routes_1.default);
app.use('/technician', technician_routes_1.default);
app.use('/chat', chat_routes_1.default);
app.use('/', user_routes_1.default);
server.listen(process.env.PORT, () => {
    console.log(`Server is started on port ${process.env.PORT}`);
});
