

export interface Session {
    user: {
        email: string
        name: string
        image?: File
    }
    expires: string
}

export interface User {
    id?: string
    name?: string
    email?: string
    password?: string
    image?: File
    phone?: string
    gender?: string
    cart?:  Cart[]
    orders?: Order[]
    isAdmin?: boolean
    address?: {
        provinceId: number
        provinceName: string
        districtId: number
        districtName: string
        wardId: number
        wardName: string
        street: string
    }

}

export interface Product {
    id?: string
    name?: string
    descriptions: string
    discount?: number
    category?: string
    sold?: number
    sizeList: Size[]
    slug?: string
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
   isChecked?: boolean
}


export interface Order {
    id?: number
    user?: User
    userId?: string
    methodPayment?: number
    transportFee?: number
    totalPayment?: number
    products?: ProductOrder[]
    status?: Status[]
    message?: string
    createdAt?: string
}


export interface ProductOrder {
    id?: string
    product?: Product
    productId?: string
    size?: Size
    sizeId?: string
    amount: number
    user?: User
}

export interface TransportMethod {
    service_id: number
    short_name: string
    service_type_id: number
}


export interface Status {
    id?: string
    name: string
    step: number
    createdAt: string
}
