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
                        address: true,
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
            const order = await prisma.order.create({
                data: {
                    id,
                    totalPayment,
                    transportFee,
                    userId,
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
                },
                select: {
                    id: true
                }
            })
            res.status(200).json({ message: "Đơn hàng đã tạo thành công", order, success: true })
        } else {
            const order = await prisma.order.create({
                data: {
                    id,
                    totalPayment,
                    transportFee,
                    userId,
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
                },
                select: {
                    id: true
                }
            })
            res.status(200).json({ message: "Đơn hàng đã tạo thành công", order, success: true })
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
            res.status(200).json({ message: "Cập nhật đơn hàng thành công", success: true })
        } else {
            res.status(200).json({ message: "Cập nhật đơn hàng thất bại", success: false })
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
            res.status(200).json({ message: "Xóa đơn hàng thành công", success: true })
        } else {
            res.status(200).json({ message: "Xóa đơn hàng thất bại", success: false })
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
                name: "Đơn hàng đã đặt",
                step: 1,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const createSecondStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "Đã xác nhận thông tin thanh toán",
                step: 2,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}


export const createThirdStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "Đang chuẩn bị hàng",
                step: 3,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const createFourStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "Đã giao cho DVVC",
                step: 4,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const createFiveStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "Giao hàng thành công",
                step: 5,
                orderId: +orderId!
            }
        })

        const order = await prisma.order.findUnique({
            where: {
                id: +orderId
            },
            select: {
                products: {
                    select: {
                        product: {
                            select: {
                                sold: true,
                                id: true
                            }
                        },
                        amount: true
                    }
                }
            }

        })


        // Update sold amount
        if (order) {
            order.products.map(async ({ amount, product }) => {
                await prisma.product.update({
                    where: {
                        id: product.id!
                    },
                    data: {
                        sold: product?.sold! + amount!,
                    }
                })
            })
        }

        res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const createSixStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "Từ chối đơn hàng",
                step: 6,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const createSevenStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "Từ chối nhận hàng",
                step: 7,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const createEightStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params

        await prisma.status.create({
            data: {
                name: "Trả hàng / hoàn tiền",
                step: 8,
                orderId: +orderId!
            }
        })

        res.status(200).json({ message: "Cập nhật trạng thái thành công", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}