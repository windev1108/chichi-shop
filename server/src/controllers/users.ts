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
            include: {
                address: {
                    select: {
                        provinceId: true,
                        districtId: true,
                        wardId: true,
                        street: true,
                        districtName: true,
                        provinceName: true,
                        wardName: true
                    }
                },
                image: {
                    select: {
                        url: true,
                        type: true,
                        publicId: true
                    }
                },
                cart: {
                    select: {
                        amount: true,
                        product: {
                            select: {
                                name: true,
                                slug: true,
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
                                name: true,
                                amount: true,
                                price: true,
                            }
                        }
                    },
                },
                orders: {
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
                                address: true,
                                image: {
                                    select: {
                                        url: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        })

        if (user?.isAdmin) {
            const orders = await prisma.order.findMany({
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
                            address: true,
                            image: {
                                select: {
                                    url: true
                                }
                            }
                        }
                    }
                }
            })
            res.status(200).json({ user: { ...user, orders , cart: user?.cart.reverse() } })
        } else {
            res.status(200).json({ user: { ...user , cart: user?.cart.reverse() } })
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
            const user = await prisma.user.update({
                where: {
                    id: req.params.id
                },
                data: {
                    name,
                    password,
                    gender,
                    phone,
                    image: {
                        create: image
                    },
                },
                select: {
                    address: true
                }
            })

            if (user.address) {
                await prisma.address.update({
                    where: {
                        userId: req.params.id as string
                    },
                    data: address
                })
            } else {
                await prisma.address.create({
                    data: {
                        ...address,
                        userId: req.params.id
                    }
                })
            }
            res.status(200).json({ message: "Cập nhật thông tin thành công", success: true })
        } else {
            const user = await prisma.user.update({
                where: {
                    id: req.params.id
                },
                data: {
                    name,
                    password,
                    gender,
                    phone,
                },
                select: {
                    address: true
                }
            })

            if (user.address!) {
                await prisma.address.update({
                    where: {
                        userId: req.params.id as string
                    },
                    data: address
                })
            } else {
                await prisma.address.create({
                    data: {
                        ...address,
                        userId: req.params.id
                    }
                })
            }
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