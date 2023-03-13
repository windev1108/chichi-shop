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
exports.createEightStatus = exports.createSevenStatus = exports.createSixStatus = exports.createFiveStatus = exports.createFourStatus = exports.createThirdStatus = exports.createSecondStatus = exports.createFirstStatus = exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrderById = exports.getOrdersByUser = exports.getOrders = void 0;
// @ts-ignore
var constants_ts_1 = require("../utils/constants.ts");
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var getOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.order.findMany({
                        orderBy: {
                            createdAt: "desc"
                        }
                    })];
            case 1:
                orders = _a.sent();
                if (orders.length > 0) {
                    res.status(200).json({ orders: orders, success: true });
                }
                else {
                    res.status(200).json({ orders: orders, success: false });
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({ message: error_1.message, success: false });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getOrders = getOrders;
var getOrdersByUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, orders, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.params.userId;
                return [4 /*yield*/, prisma.order.findMany({
                        where: {
                            userId: userId
                        },
                        orderBy: {
                            createdAt: "desc"
                        },
                        include: {
                            status: true,
                            products: {
                                include: {
                                    size: true,
                                    product: {
                                        include: {
                                            files: {
                                                select: {
                                                    url: true
                                                }
                                            }
                                        }
                                    },
                                }
                            },
                            user: {
                                select: {
                                    name: true,
                                    id: true,
                                    image: {
                                        select: {
                                            url: true
                                        }
                                    }
                                }
                            }
                        }
                    })];
            case 1:
                orders = _a.sent();
                if (orders.length > 0) {
                    res.status(200).json({ orders: orders, success: true });
                }
                else {
                    res.status(200).json({ orders: orders, success: false });
                }
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({ message: error_2.message, success: false });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getOrdersByUser = getOrdersByUser;
var getOrderById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, order, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.params.orderId;
                return [4 /*yield*/, prisma.order.findUnique({
                        where: {
                            id: +orderId
                        },
                        include: {
                            status: {
                                orderBy: {
                                    createdAt: "asc"
                                }
                            },
                            products: {
                                include: {
                                    size: true,
                                    product: {
                                        include: {
                                            files: {
                                                select: {
                                                    url: true
                                                }
                                            }
                                        }
                                    },
                                }
                            },
                            user: {
                                select: {
                                    name: true,
                                    id: true,
                                    image: {
                                        select: {
                                            url: true
                                        }
                                    }
                                }
                            },
                        },
                    })];
            case 1:
                order = _a.sent();
                if (order) {
                    res.status(200).json({ order: order, success: true });
                }
                else {
                    res.status(200).json({ order: order, success: false });
                }
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ message: error_3.message, success: false });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getOrderById = getOrderById;
var createOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, totalPayment, transportFee, userId, products, id, foundOrder, id_1, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, totalPayment = _a.totalPayment, transportFee = _a.transportFee, userId = _a.userId, products = _a.products;
                id = (0, constants_ts_1.randomNumberId)();
                return [4 /*yield*/, prisma.order.findUnique({
                        where: {
                            id: id
                        }
                    })];
            case 1:
                foundOrder = _b.sent();
                if (!foundOrder) return [3 /*break*/, 3];
                id_1 = (0, constants_ts_1.randomNumberId)();
                return [4 /*yield*/, prisma.order.create({
                        data: {
                            id: id_1,
                            totalPayment: totalPayment,
                            transportFee: transportFee,
                            userId: userId,
                            status: {
                                create: {
                                    name: "Đơn hàng đã đặt",
                                    step: 1,
                                }
                            },
                            products: {
                                createMany: {
                                    data: products
                                }
                            }
                        }
                    })];
            case 2:
                _b.sent();
                res.status(200).json({ message: "Đơn hàng đã tạo thành công", success: true });
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, prisma.order.create({
                    data: {
                        id: id,
                        totalPayment: totalPayment,
                        transportFee: transportFee,
                        userId: userId,
                        status: {
                            create: {
                                name: "Đơn hàng đã đặt",
                                step: 1,
                            }
                        },
                        products: {
                            createMany: {
                                data: products
                            }
                        }
                    }
                })];
            case 4:
                _b.sent();
                res.status(200).json({ message: "Đơn hàng đã tạo thành công", success: true });
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_4 = _b.sent();
                res.status(500).json({ message: error_4.message, success: false });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.createOrder = createOrder;
var updateOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, order, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.params.orderId;
                return [4 /*yield*/, prisma.order.update({
                        where: {
                            id: +orderId
                        },
                        data: req.body
                    })];
            case 1:
                order = _a.sent();
                if (order) {
                    res.status(200).json({ message: "Cập nhật đơn hàng thành công", success: true });
                }
                else {
                    res.status(200).json({ message: "Cập nhật đơn hàng thất bại", success: false });
                }
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(500).json({ message: error_5.message, success: false });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateOrder = updateOrder;
var deleteOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, order, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.params.orderId;
                return [4 /*yield*/, prisma.order.delete({
                        where: {
                            id: +orderId
                        },
                    })];
            case 1:
                order = _a.sent();
                if (order) {
                    res.status(200).json({ message: "Xóa đơn hàng thành công", success: true });
                }
                else {
                    res.status(200).json({ message: "Xóa đơn hàng thất bại", success: false });
                }
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                res.status(500).json({ message: error_6.message, success: false });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteOrder = deleteOrder;
var createFirstStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.params.orderId;
                return [4 /*yield*/, prisma.status.create({
                        data: {
                            name: "Đơn hàng đã đặt",
                            step: 1,
                            orderId: +orderId
                        }
                    })];
            case 1:
                _a.sent();
                res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                res.status(500).json({ message: error_7.message, success: false });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createFirstStatus = createFirstStatus;
var createSecondStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.params.orderId;
                return [4 /*yield*/, prisma.status.create({
                        data: {
                            name: "Đã xác nhận thông tin thanh toán",
                            step: 2,
                            orderId: +orderId
                        }
                    })];
            case 1:
                _a.sent();
                res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                res.status(500).json({ message: error_8.message, success: false });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createSecondStatus = createSecondStatus;
var createThirdStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.params.orderId;
                return [4 /*yield*/, prisma.status.create({
                        data: {
                            name: "Đang chuẩn bị hàng",
                            step: 3,
                            orderId: +orderId
                        }
                    })];
            case 1:
                _a.sent();
                res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                res.status(500).json({ message: error_9.message, success: false });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createThirdStatus = createThirdStatus;
var createFourStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.params.orderId;
                return [4 /*yield*/, prisma.status.create({
                        data: {
                            name: "Đã giao cho DVVC",
                            step: 4,
                            orderId: +orderId
                        }
                    })];
            case 1:
                _a.sent();
                res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true });
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                res.status(500).json({ message: error_10.message, success: false });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createFourStatus = createFourStatus;
var createFiveStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.params.orderId;
                return [4 /*yield*/, prisma.status.create({
                        data: {
                            name: "Giao hàng thành công",
                            step: 5,
                            orderId: +orderId
                        }
                    })];
            case 1:
                _a.sent();
                res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true });
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                res.status(500).json({ message: error_11.message, success: false });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createFiveStatus = createFiveStatus;
var createSixStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.params.orderId;
                return [4 /*yield*/, prisma.status.create({
                        data: {
                            name: "Từ chối đơn hàng",
                            step: 6,
                            orderId: +orderId
                        }
                    })];
            case 1:
                _a.sent();
                res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true });
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                res.status(500).json({ message: error_12.message, success: false });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createSixStatus = createSixStatus;
var createSevenStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.params.orderId;
                return [4 /*yield*/, prisma.status.create({
                        data: {
                            name: "Từ chối nhận hàng",
                            step: 7,
                            orderId: +orderId
                        }
                    })];
            case 1:
                _a.sent();
                res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true });
                return [3 /*break*/, 3];
            case 2:
                error_13 = _a.sent();
                res.status(500).json({ message: error_13.message, success: false });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createSevenStatus = createSevenStatus;
var createEightStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.params.orderId;
                return [4 /*yield*/, prisma.status.create({
                        data: {
                            name: "Trả hàng / hoàn tiền",
                            step: 8,
                            orderId: +orderId
                        }
                    })];
            case 1:
                _a.sent();
                res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true });
                return [3 /*break*/, 3];
            case 2:
                error_14 = _a.sent();
                res.status(500).json({ message: error_14.message, success: false });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createEightStatus = createEightStatus;
