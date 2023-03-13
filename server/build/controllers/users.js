"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.deleteUserById = exports.updateUserById = exports.createUser = exports.getUserById = exports.getUsers = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var getUsers = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.findMany()];
            case 1:
                users = _a.sent();
                if (users.length > 0) {
                    res.status(200).json({ users: users });
                }
                else {
                    res.status(204).json({ message: "Not found any user" });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getUsers = getUsers;
var getUserById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, orders, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            id: req.params.id
                        },
                        include: {
                            address: {
                                select: {
                                    provinceId: true,
                                    districtId: true,
                                    wardId: true,
                                    street: true,
                                    districtName: true,
                                    provinceName: true,
                                    wardName: true
                                }
                            },
                            image: {
                                select: {
                                    url: true,
                                    type: true,
                                    publicId: true
                                }
                            },
                            cart: {
                                select: {
                                    amount: true,
                                    product: {
                                        select: {
                                            name: true,
                                            slug: true,
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
                                            name: true,
                                            amount: true,
                                            price: true,
                                        }
                                    }
                                }
                            },
                            orders: {
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
                                            address: true,
                                            image: {
                                                select: {
                                                    url: true
                                                }
                                            }
                                        }
                                    }
                                },
                                orderBy: {
                                    createdAt: "desc"
                                }
                            }
                        }
                    })];
            case 1:
                user = _a.sent();
                if (!(user === null || user === void 0 ? void 0 : user.isAdmin)) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.order.findMany({
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
                                    address: true,
                                    image: {
                                        select: {
                                            url: true
                                        }
                                    }
                                }
                            }
                        }
                    })];
            case 2:
                orders = _a.sent();
                res.status(200).json({ user: __assign(__assign({}, user), { orders: orders, cart: user === null || user === void 0 ? void 0 : user.cart.reverse() }) });
                return [3 /*break*/, 4];
            case 3:
                res.status(200).json({ user: __assign(__assign({}, user), { cart: user === null || user === void 0 ? void 0 : user.cart.reverse() }) });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                res.status(500).end();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getUserById = getUserById;
var createUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, foundUser, user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                email = req.body.email;
                return [4 /*yield*/, prisma.user.findFirst({
                        where: {
                            email: email
                        }
                    })];
            case 1:
                foundUser = _a.sent();
                if (!foundUser) return [3 /*break*/, 2];
                res.status(200).json({ message: "Email đã tồn tại", success: false });
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, prisma.user.create({
                    data: req.body
                })];
            case 3:
                user = _a.sent();
                res.status(201).json({ user: user, success: true });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                res.status(500).json({ message: error_2.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createUser = createUser;
var updateUserById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, password, gender, address, phone, image, user, user, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 13, , 14]);
                _a = req.body, name = _a.name, password = _a.password, gender = _a.gender, address = _a.address, phone = _a.phone, image = _a.image;
                if (!image) return [3 /*break*/, 6];
                return [4 /*yield*/, prisma.user.update({
                        where: {
                            id: req.params.id
                        },
                        data: {
                            name: name,
                            password: password,
                            gender: gender,
                            phone: phone,
                            image: {
                                create: image
                            },
                        },
                        select: {
                            address: true
                        }
                    })];
            case 1:
                user = _b.sent();
                if (!user.address) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.address.update({
                        where: {
                            userId: req.params.id
                        },
                        data: address
                    })];
            case 2:
                _b.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, prisma.address.create({
                    data: __assign(__assign({}, address), { userId: req.params.id })
                })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                res.status(200).json({ message: "Cập nhật thông tin thành công", success: true });
                return [3 /*break*/, 12];
            case 6: return [4 /*yield*/, prisma.user.update({
                    where: {
                        id: req.params.id
                    },
                    data: {
                        name: name,
                        password: password,
                        gender: gender,
                        phone: phone,
                    },
                    select: {
                        address: true
                    }
                })];
            case 7:
                user = _b.sent();
                if (!user.address) return [3 /*break*/, 9];
                return [4 /*yield*/, prisma.address.update({
                        where: {
                            userId: req.params.id
                        },
                        data: address
                    })];
            case 8:
                _b.sent();
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, prisma.address.create({
                    data: __assign(__assign({}, address), { userId: req.params.id })
                })];
            case 10:
                _b.sent();
                _b.label = 11;
            case 11:
                res.status(200).json({ message: "Cập nhật thông tin thành công", success: true });
                _b.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                error_3 = _b.sent();
                res.status(500).json({ message: error_3.message });
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.updateUserById = updateUserById;
var deleteUserById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user.delete({
                        where: {
                            id: req.params.id
                        }
                    })];
            case 1:
                user = _a.sent();
                if (user) {
                    res.status(200).json({ message: "Xóa người dùng thành công", success: true });
                }
                else {
                    res.status(200).json({ message: "Xóa người dùng thất bại", success: false });
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
exports.deleteUserById = deleteUserById;
