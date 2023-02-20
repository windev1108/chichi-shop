import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


export const getUsers = async (_req: Request, res: Response): Promise<any> => {
    const users = await prisma.user.findMany()

    if (users.length > 0) {
        res.status(200).json({ users })
    } else {
        res.status(204).json({ message: "Not found any user" })
    }
}

export const getUserByEmail = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.params.email
            }
        })
        if (user) {
            res.status(200).json({ user })
        } else {
            res.status(204).json({ message: "Not found user" })
        }
    } catch (error) {
        res.status(500).end()
    }
}


export const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email } = req.body
        const foundUser = await prisma.user.findFirst({
            where: {
                email
            }
        })
        if (foundUser) {
            res.status(200).json({ message: "Email đã tồn tại", success: false })
        } else {
            const user = await prisma.user.create({
                data: req.body
            })
            res.status(201).json({ user, success: true })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message })

    }
}

export const updateUserById = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await prisma.user.update({
            where: {
                id: req.params.id
            },
            data: req.body
        })

        res.status(200).json({ user })
    } catch (error) {
        res.status(500).end()
    }
}

export const deleteUserById = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await prisma.user.delete({
            where: {
                id: req.params.id
            }
        })

        res.status(200).json({ user })
    } catch (error) {
        res.status(500).end()
    }
} 