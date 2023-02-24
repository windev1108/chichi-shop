import axiosInstance from '@/services/instance';


export const addProductToCart = async ({ userId, productId, amount, sizeId }: { userId: string, productId: string, sizeId: string, amount: number }) => {
    const { data } = await axiosInstance.post(`/users/${userId}/cart`, { productId, sizeId, amount })
    return data
}

export const removeProductOutCart = async ({ userId, productId }: { userId: string, productId: string }) => {
    const { data } = await axiosInstance.delete(`/users/${userId}/cart/${productId}`)
    return data
}

export const clearCart = async ({ userId }: { userId: string }) => {
    const { data } = await axiosInstance.delete(`/users/${userId}/cart`)
    return data
}

export const getCart = async ({ userId }: { userId: string }) => {
    const { data } = await axiosInstance.get(`/users/${userId}/cart`)
    return data
}

export const updateCart = async ({ userId, productId, amount, sizeId }: { userId: string, productId: string, amount?: number, sizeId?: string }) => {
    const { data } = await axiosInstance.put(`/users/${userId}/cart/${productId}`, {
        amount,
        sizeId
    })
    return data
}