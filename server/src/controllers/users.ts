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

export const getUserById = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.params.id
            },
            select: {
                id: true,
                name: true,
                address: true,
                email: true,
                gender: true,
                password: true,
                phone: true,
                isAdmin: true,
                createdAt: true,
                image: {
                    select: {
                        url: true,
                        type: true,
                        publicId: true
                    }
                }
            }
        })
        if (user) {
            res.status(200).json({ user })
        } else {
            res.status(204).json({ user: null, message: "Not found user" })
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
        const { name, password, gender, address, phone, image } = req.body
        if (image) {
            await prisma.user.update({
                where: {
                    id: req.params.id
                },
                data: {
                    name,
                    password,
                    gender,
                    address,
                    phone,
                    image: {
                        create: image
                    }
                }
            })
            res.status(200).json({ message: "Cập nhật thông tin thành công", success: true })
        } else {
            await prisma.user.update({
                where: {
                    id: req.params.id
                },
                data: {
                    name,
                    password,
                    gender,
                    address,
                    phone,
                }
            })
            res.status(200).json({ message: "Cập nhật thông tin thành công", success: true })
        }

    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteUserById = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await prisma.user.delete({
            where: {
                id: req.params.id
            }
        })
        if (user) {
            res.status(200).json({ message: "Xóa người dùng thành công", success: true })
        } else {
            res.status(200).json({ message: "Xóa người dùng thất bại", success: false })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
} 