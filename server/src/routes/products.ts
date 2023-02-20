// @ts-ignore
import { createProduct, deleteProductById, getProductBySlug, getProductByPage, updateProductById, getSellingAndNewProducts } from '../controllers/products.ts'
// @ts-ignore
import { createReviewOnProduct, deleteReviewById, getReviewById, getReviewsByProduct, updateReviewById } from '../controllers/review.ts'
import express from 'express'

const router = express.Router()

// get products by page
router.get('/', getProductByPage)

// get best selling
router.get('/selling&new', getSellingAndNewProducts)

// get product by slug
router.get('/:slug', getProductBySlug)

// add product
router.post('/', createProduct)

// update product
router.put('/:id', updateProductById)

// delete product
router.delete('/:id', deleteProductById)

// get reviews by product
router.get('/:productId/reviews', getReviewsByProduct)

// get review by product
router.get('/:productId/reviews/:reviewId', getReviewById)

// create review on product
router.post('/:productId/reviews', createReviewOnProduct)

// update review on product
router.put('/:productId/reviews/:reviewId', updateReviewById)

// delete review on product
router.delete('/:productId/reviews/:reviewId', deleteReviewById)



export default router

