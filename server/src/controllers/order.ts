// @ts-ignore
import { randomNumberId } from "../utils/constants.ts";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient()


export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        if (orders.length > 0) {
            res.status(200).json({ orders, success: true })
        } else {
            res.status(200).json({ orders, success: false })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const getOrdersByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const orders = await prisma.order.findMany({
            where: {
                userId
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
        })

        if (orders.length > 0) {
            res.status(200).json({ orders, success: true })
        } else {
            res.status(200).json({ orders, success: false })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params
        const order = await prisma.order.findUnique({
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
        })
        if (order) {
            res.status(200).json({ order, success: true })
        } else {
            res.status(200).json({ order, success: false })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { totalPayment, transportFee, userId, products } = req.body
        const id = randomNumberId()
        const foundOrder = await prisma.order.findUnique({
            where: {
                id
            }
        })
        if (foundOrder) {
            const id = randomNumberId()
            await prisma.order.create({
                data: {
                    id,
                    totalPayment,
                    transportFee,
                    userId,
                    status: {
                        create: {
                            name: "????n h??ng ???? ?????t",
                            step: 1,
                        }
                    },
                    products: {
                        createMany: {
                            data: products
                        }
                    }
                }
            })
            res.status(200).json({ message: "????n h??ng ???? t???o th??nh c??ng", success: true })
        } else {
            await prisma.order.create({
                data: {
                    id,
                    totalPayment,
                    transportFee,
                    userId,
                    status: {
                        create: {
                            name: "????n h??ng ???? ?????t",
                            step: 1,
                        }
                    },
                    products: {
                        createMany: {
                            data: products
                        }
                    }
                }
            })
            res.status(200).json({ message: "????n h??ng ???? t???o th??nh c??ng", success: true })
        }


    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params
        const order = await prisma.order.update({
            where: {
                id: +orderId
            },
            data: req.body
        })

        if (order) {
            res.status(200).json({ message: "C???p nh???t ????n h??ng th??nh c??ng", success: true })
        } else {
            res.status(200).json({ message: "C???p nh???t ????n h??ng th???t b???i", success: false })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params
        const order = await prisma.order.delete({
            where: {
                id: +orderId
            },
        })

        if (order) {
            res.status(200).json({ message: "X??a ????n h??ng th??nh c??ng", success: true })
        } else {
            res.status(200).json({ message: "X??a ????n h??ng th???t b???i", success: false })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}


export const createFirstStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "????n h??ng ???? ?????t",
                step: 1,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "C???p nh???t tr???ng th??i th??nh c??ng", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const createSecondStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "???? x??c nh???n th??ng tin thanh to??n",
                step: 2,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "C???p nh???t tr???ng th??i th??nh c??ng", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}


export const createThirdStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "??ang chu???n b??? h??ng",
                step: 3,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "C???p nh???t tr???ng th??i th??nh c??ng", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const createFourStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "???? giao cho DVVC",
                step: 4,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "C???p nh???t tr???ng th??i th??nh c??ng", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const createFiveStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "Giao h??ng th??nh c??ng",
                step: 5,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "C???p nh???t tr???ng th??i th??nh c??ng", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const createSixStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "T??? ch???i ????n h??ng",
                step: 6,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "C???p nh???t tr???ng th??i th??nh c??ng", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const createSevenStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "T??? ch???i nh???n h??ng",
                step: 7,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "C???p nh???t tr???ng th??i th??nh c??ng", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const createEightStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "Tr??? h??ng / ho??n ti???n",
                step: 8,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "C???p nh???t tr???ng th??i th??nh c??ng", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}