

export interface Session {
    user: {
        email: string
    }
    expires: string
}

export interface User {
    id?: string
    name?: string
    email?: string
    password?: string
    image?: File
    address?: string,
    phone?: number
    gender?: string
    cart?:  Cart[]
    isAdmin?: boolean
}

export interface Product {
    id?: String
    name?: String
    descriptions: string
    discount?: number
    category?: string
    sold?: number
    sizeList: Size[]
    slug?: String
    files: File[]
    updatedAt?: string
    averageRating?: number
    reviews?: Review[]
    _count?: {
        reviews?: number
    }
}

export interface Size {
    id?: string
    name?: string
    amount?: number
    price?: number
}


export interface Review {
    id?: string
    content: string
    point: number
    product?: Product
    createdAt?: string
    user?: User
    userId?: string
}

export interface File {
    id?: string
    url: string
    publicId: string
    type: string
}

export interface Cart {
   amount?: number
   size?: Size
   product?: Product
   user?: User
}

