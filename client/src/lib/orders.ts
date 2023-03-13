import axiosInstance from "@/services/instance";
import { Order } from "@/utils/types";



export const createOrder = async ({ order }: { order: Order }) => {
    const { data } = await axiosInstance.post("/orders", order)
    return data
}


export const updateOrder = async ({ order, orderId }: { order: Order, orderId: number }) => {
    const { data } = await axiosInstance.put(`/orders/${orderId}`, order)
    return data
}


export const deleteOrder = async ({ orderId }: { orderId: number }) => {
    const { data } = await axiosInstance.delete(`/orders/${orderId}`)
    return data
}

export const getOrders = async () => {
    const { data } = await axiosInstance.get(`/orders`)
    return data
}


export const getOrdersByUser = async ({ userId }: { userId: number }) => {
    const { data } = await axiosInstance.get(`/orders/users/${userId}`)
    return data
}


export const getOrderById = async ({ orderId }: { orderId: string }) => {
    const { data } = await axiosInstance.get(`/orders/${orderId}`)
    return data
}

export const createFirstStatus = async ({ orderId }: { orderId: number }) => {
    const { data } = await axiosInstance.get(`/orders/${orderId}/status/1`)
    return data
}

export const createSecondStatus = async ({ orderId }: { orderId: number }) => {
    const { data } = await axiosInstance.get(`/orders/${orderId}/status/2`)
    return data
}
export const createThirdStatus = async ({ orderId }: { orderId: number }) => {
    const { data } = await axiosInstance.get(`/orders/${orderId}/status/3`)
    return data
}
export const createFourStatus = async ({ orderId }: { orderId: number }) => {
    const { data } = await axiosInstance.get(`/orders/${orderId}/status/4`)
    return data
}
export const createFiveStatus = async ({ orderId }: { orderId: number }) => {
    const { data } = await axiosInstance.get(`/orders/${orderId}/status/5`)
    return data
}
export const createSixStatus = async ({ orderId }: { orderId: number }) => {
    const { data } = await axiosInstance.get(`/orders/${orderId}/status/6`)
    return data
}
export const createSevenStatus = async ({ orderId }: { orderId: number }) => {
    const { data } = await axiosInstance.get(`/orders/${orderId}/status/7`)
    return data
}
export const createEightStatus = async ({ orderId }: { orderId: number }) => {
    const { data } = await axiosInstance.get(`/orders/${orderId}/status/8`)
    return data
}
