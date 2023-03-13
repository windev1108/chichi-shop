"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var users_ts_1 = __importDefault(require("./routes/users.js"));
// @ts-ignore
var products_ts_1 = __importDefault(require("./routes/products.js"));
// @ts-ignore
var search_ts_1 = __importDefault(require("./routes/search.js"));
// @ts-ignore
var order_ts_1 = __importDefault(require("./routes/order.js"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var body_parser_1 = __importDefault(require("body-parser"));
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(body_parser_1.default.json());
app.use(express_1.default.json({ limit: '30mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '60mb' }));
app.use('/users', users_ts_1.default);
app.use('/products', products_ts_1.default);
app.use('/search', search_ts_1.default);
app.use('/orders', order_ts_1.default);
app.use('/', function (_req, res) {
    res.json({ message: "This is home page API" });
});
var server = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.BASE_URL,
    }
});
var PORT = process.env.PORT || 5000;
io.on("connection", function (socket) {
    console.log("Socket ".concat(socket.id, " connected"));
    socket.on("updateOrder", function () {
        socket.broadcast.emit("updateOrder");
    });
});
server.listen(PORT, function () {
    console.log("Server on running on port ".concat(PORT));
});
