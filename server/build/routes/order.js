"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var order_ts_1 = require("../controllers/order.js");
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/", order_ts_1.getOrders);
router.get("/:orderId", order_ts_1.getOrderById);
router.get("/users/:userId", order_ts_1.getOrdersByUser);
router.post("/", order_ts_1.createOrder);
router.put("/:orderId", order_ts_1.updateOrder);
router.delete("/:orderId", order_ts_1.deleteOrder);
router.get("/:orderId/status/1", order_ts_1.createFirstStatus);
router.get("/:orderId/status/2", order_ts_1.createSecondStatus);
router.get("/:orderId/status/3", order_ts_1.createThirdStatus);
router.get("/:orderId/status/4", order_ts_1.createFourStatus);
router.get("/:orderId/status/5", order_ts_1.createFiveStatus);
router.get("/:orderId/status/6", order_ts_1.createSixStatus);
router.get("/:orderId/status/7", order_ts_1.createSevenStatus);
router.get("/:orderId/status/8", order_ts_1.createEightStatus);
exports.default = router;
