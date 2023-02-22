"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var products_ts_1 = require("../controllers/products.js");
var review_ts_1 = require("../controllers/review.js");
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
// get products by page
router.get('/', products_ts_1.getProductByPage);
// get best selling
router.get('/selling&new', products_ts_1.getSellingAndNewProducts);
// get product by slug
router.get('/:slug', products_ts_1.getProductBySlug);
// add product
router.post('/', products_ts_1.createProduct);
// update product
router.put('/:id', products_ts_1.updateProductById);
// delete product
router.delete('/:id', products_ts_1.deleteProductById);
// get reviews by product
router.get('/:productId/reviews', review_ts_1.getReviewsByProduct);
// get review by product
router.get('/:productId/reviews/:reviewId', review_ts_1.getReviewById);
// create review on product
router.post('/:productId/reviews', review_ts_1.createReviewOnProduct);
// update review on product
router.put('/:productId/reviews/:reviewId', review_ts_1.updateReviewById);
// delete review on product
router.delete('/:productId/reviews/:reviewId', review_ts_1.deleteReviewById);
exports.default = router;
