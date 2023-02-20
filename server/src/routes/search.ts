// @ts-ignore
import { getProductsByKeyword } from '../controllers/products.ts'
import express from 'express'

const router = express.Router()


router.get("/", getProductsByKeyword)

export default router