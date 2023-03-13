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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductById = exports.updateProductById = exports.createProduct = exports.getProductsByKeyword = exports.getProductBySlug = exports.getSellingAndNewProducts = exports.getProductByPage = exports.getProducts = void 0;
var constants_1 = require("./../utils/constants");
var client_1 = require("@prisma/client");
var slugify_1 = __importDefault(require("slugify"));
var prisma = new client_1.PrismaClient();
var getProducts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var products, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.product.findMany({
                        include: {
                            files: true,
                            sizeList: true,
                        },
                        orderBy: {
                            createdAt: "desc"
                        },
                    })];
            case 1:
                products = _a.sent();
                res.status(200).json({ products: products });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({ message: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProducts = getProducts;
var getProductByPage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, type, products, countProducts, customProducts, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, page = _a.page, type = _a.type;
                return [4 /*yield*/, prisma.product.findMany({
                        skip: (+process.env.MAX_ITEM_IN_PAGE * +page - +process.env.MAX_ITEM_IN_PAGE),
                        take: +process.env.MAX_ITEM_IN_PAGE,
                        where: {
                            category: {
                                equals: type
                            }
                        },
                        include: {
                            files: {
                                select: {
                                    url: true,
                                    type: true,
                                    publicId: true
                                }
                            },
                            sizeList: {
                                take: 1,
                                orderBy: {
                                    price: "asc"
                                },
                                select: {
                                    amount: true,
                                    name: true,
                                    price: true,
                                }
                            },
                            reviews: {
                                select: {
                                    point: true
                                }
                            },
                            _count: {
                                select: {
                                    reviews: true
                                }
                            }
                        },
                        orderBy: {
                            createdAt: "desc",
                        }
                    })];
            case 1:
                products = _b.sent();
                return [4 /*yield*/, prisma.product.count({
                        where: {
                            category: {
                                equals: type
                            }
                        },
                    })];
            case 2:
                countProducts = _b.sent();
                customProducts = products.map(function (product) {
                    return __assign(__assign({}, product), { averageRating: (0, constants_1.formatReviews)(product.reviews) });
                });
                res.status(200).json({ products: customProducts, totalPage: countProducts / +process.env.MAX_ITEM_IN_PAGE <= 1 ? 1 : Math.floor(countProducts / +process.env.MAX_ITEM_IN_PAGE) });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                res.status(500).json({ message: error_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getProductByPage = getProductByPage;
var getSellingAndNewProducts = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var selling, news, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, prisma.product.findMany({
                        orderBy: {
                            sold: "desc"
                        },
                        include: {
                            files: {
                                take: 1,
                                select: {
                                    type: true,
                                    url: true,
                                }
                            },
                            sizeList: true,
                            reviews: true,
                            _count: {
                                select: {
                                    reviews: true
                                }
                            }
                        },
                    })];
            case 1:
                selling = _a.sent();
                return [4 /*yield*/, prisma.product.findMany({
                        orderBy: {
                            createdAt: "desc"
                        }, take: 10,
                        include: {
                            files: {
                                take: 1,
                                select: {
                                    type: true,
                                    url: true,
                                }
                            },
                            sizeList: true,
                            reviews: true,
                            _count: {
                                select: {
                                    reviews: true
                                }
                            }
                        },
                    })];
            case 2:
                news = _a.sent();
                res.status(200).json({
                    selling: selling.map(function (product) {
                        return __assign(__assign({}, product), { averageRating: (0, constants_1.formatReviews)(product.reviews) });
                    }), news: news.map(function (product) {
                        return __assign(__assign({}, product), { averageRating: (0, constants_1.formatReviews)(product.reviews) });
                    })
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500).end();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getSellingAndNewProducts = getSellingAndNewProducts;
var getProductBySlug = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var slug, product, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                slug = req.params.slug;
                return [4 /*yield*/, prisma.product.findUnique({
                        where: {
                            slug: slug
                        },
                        include: {
                            files: {
                                select: {
                                    url: true,
                                    type: true,
                                    publicId: true
                                }
                            },
                            sizeList: {
                                select: {
                                    id: true,
                                    name: true,
                                    amount: true,
                                    price: true,
                                }
                            },
                            reviews: {
                                select: {
                                    id: true,
                                    content: true,
                                    point: true,
                                    createdAt: true,
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            image: true,
                                        }
                                    }
                                }
                            }
                        }
                    })];
            case 1:
                product = _a.sent();
                if (product) {
                    res.status(200).json({ product: __assign(__assign({}, product), { averageRating: (0, constants_1.formatReviews)(product.reviews) }) });
                }
                else {
                    res.status(204).json({ message: "Not found product" });
                }
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).end();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProductBySlug = getProductBySlug;
var getProductsByKeyword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var keyword, products, countProducts, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                keyword = req.query.keyword;
                return [4 /*yield*/, prisma.product.findMany({
                        where: {
                            name: {
                                contains: keyword
                            }
                        },
                        include: {
                            files: {
                                select: {
                                    url: true,
                                    type: true
                                },
                                take: 1
                            },
                            sizeList: {
                                select: {
                                    price: true
                                },
                                take: 1,
                                orderBy: {
                                    price: "desc"
                                }
                            },
                            reviews: {
                                select: {
                                    point: true
                                }
                            },
                            _count: {
                                select: {
                                    reviews: true
                                }
                            }
                        }
                    })];
            case 1:
                products = _a.sent();
                return [4 /*yield*/, prisma.product.count({
                        where: {
                            name: {
                                contains: keyword
                            }
                        },
                    })];
            case 2:
                countProducts = _a.sent();
                res.status(200).json({
                    products: products.map(function (product) {
                        return __assign(__assign({}, product), { averageRating: (0, constants_1.formatReviews)(product.reviews) });
                    }), totalPage: countProducts / +process.env.MAX_ITEM_IN_PAGE <= 1 ? 1 : Math.floor(countProducts / +process.env.MAX_ITEM_IN_PAGE)
                });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.status(500).end();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getProductsByKeyword = getProductsByKeyword;
var createProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, descriptions, discount, sizeList, category, files, productExisting, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, name = _a.name, descriptions = _a.descriptions, discount = _a.discount, sizeList = _a.sizeList, category = _a.category, files = _a.files;
                return [4 /*yield*/, prisma.product.findUnique({
                        where: {
                            slug: (0, slugify_1.default)(name, {
                                lower: true
                            })
                        }
                    })];
            case 1:
                productExisting = _b.sent();
                if (!productExisting) return [3 /*break*/, 2];
                res.status(200).json({ message: "Tên sản phẩm này đã tồn tại", success: false });
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, prisma.product.create({
                    data: {
                        name: name,
                        discount: discount,
                        descriptions: descriptions,
                        category: category,
                        slug: (0, slugify_1.default)(name, {
                            lower: true
                        }),
                        sizeList: {
                            createMany: {
                                data: sizeList
                            }
                        },
                        files: {
                            createMany: {
                                data: files.reverse()
                            }
                        }
                    },
                })];
            case 3:
                _b.sent();
                res.status(201).json({ message: "Thêm sản phẩm thành công", success: true });
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_6 = _b.sent();
                res.status(500).json({ message: error_6.message, success: false });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createProduct = createProduct;
var updateProductById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, descriptions, discount, sizeList, files, productExisting, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                _a = req.body, name = _a.name, descriptions = _a.descriptions, discount = _a.discount, sizeList = _a.sizeList, files = _a.files;
                return [4 /*yield*/, prisma.product.findUnique({
                        where: {
                            slug: (0, slugify_1.default)(name, {
                                lower: true
                            })
                        }
                    })];
            case 1:
                productExisting = _b.sent();
                if (!(productExisting && productExisting.id !== req.params.id)) return [3 /*break*/, 2];
                res.status(200).json({ message: "Tên sản phẩm này đã tồn tại", success: false });
                return [3 /*break*/, 7];
            case 2:
                if (!files) return [3 /*break*/, 4];
                return [4 /*yield*/, prisma.product.update({
                        where: {
                            id: req.params.id
                        },
                        data: {
                            name: name,
                            discount: discount,
                            descriptions: descriptions,
                            slug: (0, slugify_1.default)(name, {
                                lower: true
                            }),
                            sizeList: {
                                deleteMany: {},
                                createMany: {
                                    data: sizeList
                                }
                            },
                            files: {
                                deleteMany: {},
                                createMany: {
                                    data: files
                                }
                            }
                        },
                        select: {
                            id: true
                        }
                    })];
            case 3:
                _b.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, prisma.product.update({
                    where: {
                        id: req.params.id
                    },
                    data: {
                        name: name,
                        discount: discount,
                        descriptions: descriptions,
                        slug: (0, slugify_1.default)(name, {
                            lower: true
                        }),
                        sizeList: {
                            deleteMany: {},
                            createMany: {
                                data: sizeList
                            }
                        },
                    },
                    select: {
                        id: true
                    }
                })];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                res.status(200).json({ message: "Cập nhật sản phẩm thành công", success: true });
                _b.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_7 = _b.sent();
                res.status(500).json({ message: error_7.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.updateProductById = updateProductById;
var deleteProductById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.product.delete({
                        where: {
                            id: req.params.id
                        }
                    })];
            case 1:
                product = _a.sent();
                res.status(200).json({ product: product });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                res.status(500).json({ message: error_8.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteProductById = deleteProductById;
