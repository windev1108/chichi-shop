import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"


const prisma = new PrismaClient()



export const addProductToCart = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params
        const { productId, amount, sizeId } = req.body

        const cart = await prisma.cart.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            },
            select: {
                amount: true,
                size: {
                    select: {
                        id: true
                    }
                }
            }
        })

        if (cart) {
            await prisma.cart.update({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    },
                },
                data: {
                    amount: amount + cart.amount,
                    size: {
                        connect: {
                            id: sizeId
                        }
                    },
                }
            })
            res.status(200).json({ message: "Thêm vào giỏ hàng thành công", success: true })
        } else {
            await prisma.cart.create({
                data: {
                    amount,
                    sizeId,
                    productId,
                    userId
                }
            })
            res.status(200).json({ message: "Thêm vào giỏ hàng thành công", success: true })
        }

    } catch (error: any) {
        res.status(500).json({ message: error.message })

    }
}

export const removeProductOutCart = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, productId } = req.params
        const cart = await prisma.cart.delete({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        })
        if (cart) {
            res.status(200).json({ message: "Xóa sản phẩm thành công", success: true })
        } else {
            res.status(200).json({ message: "Xóa sản phẩm thất bại", success: false })
        }

    } catch (error: any) {
        res.status(500).json({ message: error.message })

    }
}

export const updateCart = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, productId } = req.params
        const { amount, sizeId } = req.body

        if (sizeId) {
            const cart = await prisma.cart.update({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    },
                },
                data: {
                    size: {
                        connect: {
                            id: sizeId
                        }
                    }
                },
                select: {
                    size: {
                        select: {
                            name: true
                        }
                    }
                }
            })
            res.status(200).json({ cart, message: "Sửa giỏ hàng thành công", success: true })
        } else {
            const cart = await prisma.cart.update({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    },
                },
                data: {
                    amount,
                }
            })
            res.status(200).json({ cart, message: "Sửa giỏ hàng thành công", success: true })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message })

    }
}


export const clearCart = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params
        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                cart: {
                    deleteMany: {}
                }
            }
        })

        if (user) {
            res.status(200).json({ message: "Xóa giỏ thành công", success: true })
        } else {
            res.status(200).json({ message: "Xóa giỏ hàng thật bại", success: false })
        }

    } catch (error: any) {
        res.status(500).json({ message: error.message })

    }
}

export const getCart = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                cart: {
                    select: {
                        amount: true,
                        product: {
                            select: {
                                name: true,
                                slug: true,
                                id: true,
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
                                id: true,
                                name: true,
                                amount: true,
                                price: true,
                            }
                        }
                    }
                }
            }
        })
        if (user) {
            res.status(200).json({ cart: user.cart, success: true })
        } else {
            res.status(200).json({ cart: null, success: false })
        }

    } catch (error: any) {
        res.status(500).json({ message: error.message })

    }
}

export const plusProductItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, productId } = req.params
        const cart = await prisma.cart.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            },
            select: {
                amount: true
            }
        })

        await prisma.cart.update({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            },
            data: {
                amount: cart?.amount! + 1
            }
        })

        res.status(200).json({ message: "Thêm số lượng thành công", success: true })
    } catch (error: any) {
        res.status(500).json({ message: error.message })

    }
}

export const takeAwayProductItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, productId } = req.params
        const cart = await prisma.cart.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            },
            select: {
                amount: true
            }
        })

        if (cart?.amount! <= 1) {
            await prisma.cart.delete({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    }
                }
            })
            res.status(200).json({ message: "Xóa sản phẩm thành công", success: true })
        } else {
            await prisma.cart.update({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    }
                },
                data: {
                    amount: cart?.amount! - 1
                }
            })
            res.status(200).json({ message: "Thêm số lượng thành công", success: true })
        }


    } catch (error: any) {
        res.status(500).json({ message: error.message })

    }
}

