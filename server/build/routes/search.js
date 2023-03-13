"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var products_ts_1 = require("../controllers/products.ts");
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/", products_ts_1.getProductsByKeyword);
exports.default = router;
