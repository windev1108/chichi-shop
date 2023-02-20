import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


export const getReviewsByProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { productId } = req.params
        const reviews = await prisma.review.findMany({
            where: {
                productId
            }
        })
        reviews.length > 0 ? res.status(200).json({ reviews }) :
            res.status(204).json({ message: "Not found any review" })

    } catch (error) {
        res.status(500).end()
    }
}

export const getReviewById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { reviewId } = req.params
        const review = await prisma.review.findUnique({
            where: {
                id: reviewId
            }
        })

        if (review) {
            res.status(200).json({ review })
        } else {
            res.status(204).json({ message: "Not found product" })
        }
    } catch (error) {
        res.status(500).end()
    }
}

export const createReviewOnProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { productId } = req.params
        const review = await prisma.review.create({
            data: {
                ...req.body,
                productId
            }
        })
        res.status(201).json({ review })
    } catch (error) {
        res.status(500).end()

    }
}

export const updateReviewById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { reviewId } = req.params
        const review = await prisma.review.update({
            where: {
                id: reviewId
            },
            data: req.body
        })

        res.status(200).json({ review })
    } catch (error) {
        res.status(500).end()
    }
}

export const deleteReviewById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { reviewId } = req.params
        const review = await prisma.review.delete({
            where: {
                id: reviewId
            }
        })
        res.status(200).json({ review })
    } catch (error) {
        res.status(500).end()
    }
} 