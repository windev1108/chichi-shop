import { formatReviews } from './../utils/constants';
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"
import slugify from 'slugify'

const prisma = new PrismaClient()



export const getProducts = async (_req: Request, res: Response): Promise<any> => {
    try {
        const products = await prisma.product.findMany({
            include: {
                files: true,
                sizeList: true,
            },
            orderBy: {
                createdAt: "desc"
            },
        })
        res.status(200).json({ products })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export const getProductByPage = async (req: Request, res: Response): Promise<any> => {
    try {
        const { page } = req.query

        const products = await prisma.product.findMany({
            skip: (+process.env.MAX_ITEM_IN_PAGE! * +page! - +process.env.MAX_ITEM_IN_PAGE!),
            take: +process.env.MAX_ITEM_IN_PAGE!,
            include: {
                files: {
                    select: {
                        url: true,
                        type: true,
                        publicId: true
                    }
                },
                sizeList: {
                    take: 1,
                    orderBy: {
                        price: "asc"
                    },
                    select: {
                        amount: true,
                        name: true,
                        price: true,
                    }
                },
                reviews: {
                    select: {
                        point: true
                    }
                },
                _count: {
                    select: {
                        reviews: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        }
        )



        const countProducts = await prisma.product.count()
        const customProducts = products.map((product) => {
            return {
                ...product,
                averageRating: formatReviews(product.reviews)

            }
        })
        res.status(200).json({ products: customProducts, totalPage: countProducts / +process.env.MAX_ITEM_IN_PAGE! <= 1 ? 1 : Math.floor(countProducts / +process.env.MAX_ITEM_IN_PAGE!) })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export const getSellingAndNewProducts = async (_req: Request, res: Response): Promise<any> => {
    try {
        const selling = await prisma.product.findMany({
            orderBy: {
                sold: "desc"
            },
            include: {
                files: {
                    take: 1,
                    select: {
                        type: true,
                        url: true,
                    }
                },
                sizeList: true,
                reviews: true,
                _count: {
                    select: {
                        reviews: true
                    }
                }
            },
        })
        const news = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc"
            }, take: 10,
            include: {
                files: {
                    take: 1,
                    select: {
                        type: true,
                        url: true,
                    }
                },
                sizeList: true,
                reviews: true,
                _count: {
                    select: {
                        reviews: true
                    }
                }
            },
        })

        res.status(200).json({
            selling: selling.map((product) => {
                return {
                    ...product,
                    averageRating: formatReviews(product.reviews)
                }
            }), news: news.map((product) => {
                return {
                    ...product,
                    averageRating: formatReviews(product.reviews)
                }
            })
        })
    } catch (error) {
        res.status(500).end()
    }
}

export const getProductBySlug = async (req: Request, res: Response): Promise<any> => {
    try {
        const { slug } = req.params
        const product = await prisma.product.findUnique({
            where: {
                slug
            },
            include: {
                files: {
                    select: {
                        url: true,
                        type: true,
                        publicId: true
                    }
                },
                sizeList: {
                    select: {
                        id: true,
                        name: true,
                        amount: true,
                        price: true,
                    }
                },
                reviews: {
                    select: {
                        id: true,
                        content: true,
                        point: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            }
                        }
                    }
                }
            }
        })

        if (product) {
            res.status(200).json({ product: { ...product, averageRating: formatReviews(product.reviews) } })
        } else {
            res.status(204).json({ message: "Not found product" })
        }
    } catch (error) {
        res.status(500).end()
    }
}

export const getProductsByKeyword = async (req: Request, res: Response): Promise<any> => {
    try {
        const { keyword } = req.query
        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: keyword as string
                }
            },
            include: {
                files: {
                    select: {
                        url: true,
                        type: true
                    },
                    take: 1
                },
                sizeList: {
                    select: {
                        price: true
                    },
                    take: 1,
                    orderBy: {
                        price: "desc"
                    }
                },
                reviews: {
                    select: {
                        point: true
                    }
                },
                _count: {
                    select: {
                        reviews: true
                    }
                }
            }
        })

        const countProducts = await prisma.product.count({
            where: {
                name: {
                    contains: keyword as string
                }
            },
        })

        res.status(200).json({
            products: products.map((product) => {
                return {
                    ...product,
                    averageRating: formatReviews(product.reviews)

                }
            }), totalPage: countProducts / +process.env.MAX_ITEM_IN_PAGE! <= 1 ? 1 : Math.floor(countProducts / +process.env.MAX_ITEM_IN_PAGE!)
        })
    } catch (error) {
        res.status(500).end()
    }
}

export const createProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, descriptions, discount, sizeList, files } = req.body
        const productExisting = await prisma.product.findUnique({
            where: {
                slug: slugify(name, {
                    lower: true
                })
            }
        })

        if (productExisting) {
            res.status(200).json({ message: "Tên sản phẩm này đã tồn tại", success: false })
        } else {
            await prisma.product.create({
                data: {
                    name,
                    discount,
                    descriptions,
                    slug: slugify(name, {
                        lower: true
                    }),
                    sizeList: {
                        createMany: {
                            data: sizeList
                        }
                    },
                    files: {
                        createMany: {
                            data: files.reverse()
                        }
                    }
                },
            })
            res.status(201).json({ message: "Thêm sản phẩm thành công", success: true })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const updateProductById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, descriptions, discount, sizeList, files } = req.body

        const productExisting = await prisma.product.findUnique({
            where: {
                slug: slugify(name, {
                    lower: true
                })
            }
        })

        if (productExisting && productExisting.id !== req.params.id) {
            res.status(200).json({ message: "Tên sản phẩm này đã tồn tại", success: false })
        } else {
            if (files) {
                await prisma.product.update({
                    where: {
                        id: req.params.id
                    },
                    data: {
                        name,
                        discount,
                        descriptions,
                        slug: slugify(name, {
                            lower: true
                        }),
                        sizeList: {
                            deleteMany: {},
                            createMany: {
                                data: sizeList
                            }
                        },
                        files: {
                            deleteMany: {},
                            createMany: {
                                data: files
                            }
                        }
                    },
                    select: {
                        id: true
                    }
                })
            } else {
                await prisma.product.update({
                    where: {
                        id: req.params.id
                    },
                    data: {
                        name,
                        discount,
                        descriptions,
                        slug: slugify(name, {
                            lower: true
                        }),
                        sizeList: {
                            deleteMany: {},
                            createMany: {
                                data: sizeList
                            }
                        },
                    },
                    select: {
                        id: true
                    }
                })
            }


            res.status(200).json({ message: "Cập nhật sản phẩm thành công", success: true })

        }

    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteProductById = async (req: Request, res: Response): Promise<any> => {
    try {
        const product = await prisma.product.delete({
            where: {
                id: req.params.id
            }
        })

        res.status(200).json({ product })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
} 