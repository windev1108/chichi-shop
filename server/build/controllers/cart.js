"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeAwayProductItem = exports.plusProductItem = exports.getCart = exports.clearCart = exports.updateCart = exports.removeProductOutCart = exports.addProductToCart = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var addProductToCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, productId, amount, sizeId, cart, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                userId = req.params.userId;
                _a = req.body, productId = _a.productId, amount = _a.amount, sizeId = _a.sizeId;
                return [4 /*yield*/, prisma.cart.findUnique({
                        where: {
                            userId_productId: {
                                userId: userId,
                                productId: productId
                            }
                        },
                        select: {
                            amount: true,
                            size: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    })];
            case 1:
                cart = _b.sent();
                if (!cart) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.cart.update({
                        where: {
                            userId_productId: {
                                userId: userId,
                                productId: productId
                            },
                        },
                        data: {
                            amount: amount + cart.amount,
                            size: {
                                connect: {
                                    id: sizeId
                                }
                            },
                        }
                    })];
            case 2:
                _b.sent();
                res.status(200).json({ message: "Thêm vào giỏ hàng thành công", success: true });
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, prisma.cart.create({
                    data: {
                        amount: amount,
                        sizeId: sizeId,
                        productId: productId,
                        userId: userId
                    }
                })];
            case 4:
                _b.sent();
                res.status(200).json({ message: "Thêm vào giỏ hàng thành công", success: true });
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                res.status(500).json({ message: error_1.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.addProductToCart = addProductToCart;
var removeProductOutCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, productId, cart, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, userId = _a.userId, productId = _a.productId;
                return [4 /*yield*/, prisma.cart.delete({
                        where: {
                            userId_productId: {
                                userId: userId,
                                productId: productId
                            }
                        }
                    })];
            case 1:
                cart = _b.sent();
                if (cart) {
                    res.status(200).json({ message: "Xóa sản phẩm thành công", success: true });
                }
                else {
                    res.status(200).json({ message: "Xóa sản phẩm thất bại", success: false });
                }
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                res.status(500).json({ message: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.removeProductOutCart = removeProductOutCart;
var updateCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, productId, _b, amount, sizeId, cart, cart, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                _a = req.params, userId = _a.userId, productId = _a.productId;
                _b = req.body, amount = _b.amount, sizeId = _b.sizeId;
                if (!sizeId) return [3 /*break*/, 2];
                return [4 /*yield*/, prisma.cart.update({
                        where: {
                            userId_productId: {
                                userId: userId,
                                productId: productId
                            },
                        },
                        data: {
                            size: {
                                connect: {
                                    id: sizeId
                                }
                            }
                        },
                        select: {
                            size: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    })];
            case 1:
                cart = _c.sent();
                res.status(200).json({ cart: cart, message: "Sửa giỏ hàng thành công", success: true });
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, prisma.cart.update({
                    where: {
                        userId_productId: {
                            userId: userId,
                            productId: productId
                        },
                    },
                    data: {
                        amount: amount,
                    }
                })];
            case 3:
                cart = _c.sent();
                res.status(200).json({ cart: cart, message: "Sửa giỏ hàng thành công", success: true });
                _c.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_3 = _c.sent();
                res.status(500).json({ message: error_3.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateCart = updateCart;
var clearCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.params.userId;
                return [4 /*yield*/, prisma.user.update({
                        where: {
                            id: userId
                        },
                        data: {
                            cart: {
                                deleteMany: {}
                            }
                        }
                    })];
            case 1:
                user = _a.sent();
                if (user) {
                    res.status(200).json({ message: "Xóa giỏ thành công", success: true });
                }
                else {
                    res.status(200).json({ message: "Xóa giỏ hàng thật bại", success: false });
                }
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).json({ message: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.clearCart = clearCart;
var getCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.params.userId;
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            id: userId
                        },
                        select: {
                            cart: {
                                select: {
                                    amount: true,
                                    product: {
                                        select: {
                                            name: true,
                                            slug: true,
                                            id: true,
                                            discount: true,
                                            sizeList: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    price: true,
                                                    amount: true
                                                }
                                            },
                                            files: {
                                                select: {
                                                    url: true,
                                                },
                                                take: 1
                                            }
                                        }
                                    },
                                    size: {
                                        select: {
                                            id: true,
                                            name: true,
                                            amount: true,
                                            price: true,
                                        }
                                    }
                                }
                            }
                        }
                    })];
            case 1:
                user = _a.sent();
                if (user) {
                    res.status(200).json({ cart: user.cart, success: true });
                }
                else {
                    res.status(200).json({ cart: null, success: false });
                }
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(500).json({ message: error_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCart = getCart;
var plusProductItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, productId, cart, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.params, userId = _a.userId, productId = _a.productId;
                return [4 /*yield*/, prisma.cart.findUnique({
                        where: {
                            userId_productId: {
                                userId: userId,
                                productId: productId
                            }
                        },
                        select: {
                            amount: true
                        }
                    })];
            case 1:
                cart = _b.sent();
                return [4 /*yield*/, prisma.cart.update({
                        where: {
                            userId_productId: {
                                userId: userId,
                                productId: productId
                            }
                        },
                        data: {
                            amount: (cart === null || cart === void 0 ? void 0 : cart.amount) + 1
                        }
                    })];
            case 2:
                _b.sent();
                res.status(200).json({ message: "Thêm số lượng thành công", success: true });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                res.status(500).json({ message: error_6.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.plusProductItem = plusProductItem;
var takeAwayProductItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, productId, cart, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.params, userId = _a.userId, productId = _a.productId;
                return [4 /*yield*/, prisma.cart.findUnique({
                        where: {
                            userId_productId: {
                                userId: userId,
                                productId: productId
                            }
                        },
                        select: {
                            amount: true
                        }
                    })];
            case 1:
                cart = _b.sent();
                if (!((cart === null || cart === void 0 ? void 0 : cart.amount) <= 1)) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.cart.delete({
                        where: {
                            userId_productId: {
                                userId: userId,
                                productId: productId
                            }
                        }
                    })];
            case 2:
                _b.sent();
                res.status(200).json({ message: "Xóa sản phẩm thành công", success: true });
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, prisma.cart.update({
                    where: {
                        userId_productId: {
                            userId: userId,
                            productId: productId
                        }
                    },
                    data: {
                        amount: (cart === null || cart === void 0 ? void 0 : cart.amount) - 1
                    }
                })];
            case 4:
                _b.sent();
                res.status(200).json({ message: "Thêm số lượng thành công", success: true });
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_7 = _b.sent();
                res.status(500).json({ message: error_7.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.takeAwayProductItem = takeAwayProductItem;
