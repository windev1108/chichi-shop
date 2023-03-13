"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var cart_ts_1 = require("../controllers/cart.ts");
// @ts-ignore
var users_ts_1 = require("../controllers/users.ts");
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
// get all users
router.get('/', users_ts_1.getUsers);
// get user by id
router.get('/:id', users_ts_1.getUserById);
// add user
router.post('/', users_ts_1.createUser);
// update user
router.put('/:id', users_ts_1.updateUserById);
// delete user
router.delete('/:id', users_ts_1.deleteUserById);
// get cart 
router.get('/:userId/cart', cart_ts_1.getCart);
// add To cart
router.post('/:userId/cart', cart_ts_1.addProductToCart);
// update cart
router.put('/:userId/cart/:productId', cart_ts_1.updateCart);
router.delete('/:userId/cart/:productId', cart_ts_1.removeProductOutCart);
// remove product
router.delete('/:userId/cart', cart_ts_1.clearCart);
router.get('/:userId/cart/:productId/plus', cart_ts_1.plusProductItem);
router.get('/:userId/cart/:productId/takeAway', cart_ts_1.takeAwayProductItem);
exports.default = router;
