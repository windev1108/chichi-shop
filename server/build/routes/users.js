"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = router;
