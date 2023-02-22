import axiosInstance from '@/services/instance';
import { Product } from '@/utils/types';



export const getProductsByKeywords = async ({keyword} : { keyword : string}) => {
    const { data } = await axiosInstance.get(`/search?keyword=${keyword}`)
    return data
}

export const getProductsByPage = async ({ page }: { page: string }) => {
    if (+page || typeof page === "undefined") {
        const { data } = await axiosInstance.get(`/products?page=${page || 1}`)
        return data
    } else {
        const { data } = await axiosInstance.get(`/products?page=${1}`)
        return data
    }
}


export const getSellingAndNewProduct = async () => {
    const { data } = await axiosInstance.get('/products/selling&new')
    return data
}

export const getProductBySlug = async ({ slug }: { slug: string }) => {
    const { data } = await axiosInstance.get(`/products/${slug}`)
    return data
}

export const createProduct = async ({ product }: { product: Product }) => {
    const { data } = await axiosInstance.post('/products', product)
    return data
}


export const updateProduct = async ({ productId, product }: { productId: string, product: Product }) => {
    const { data } = await axiosInstance.put(`/products/${productId}`, product)
    return data
}

export const deleteProduct = async ({ productId }: { productId: string }) => {
    const { data } = await axiosInstance.delete(`/products/${productId}`)
    return data
}