import axiosInstance from "@/services/instance";
import { Order } from "@/utils/types";



export const createOrder = async ({ order }: { order: Order }) => {
    const { data } = await axiosInstance.post("/orders", order)
    return data
}


export const updateOrder = async ({ order, orderId }: { order: Order, orderId: string }) => {
    const { data } = await axiosInstance.put(`/orders/${orderId}`, order)
    return data
}


export const deleteOrder = async ({ orderId }: { orderId: string }) => {
    const { data } = await axiosInstance.delete(`/orders/${orderId}`)
    return data
}

export const getOrders = async () => {
    const { data } = await axiosInstance.delete(`/orders`)
    return data
}


export const getOrdersByUser = async ({ userId }: { userId: string }) => {
    const { data } = await axiosInstance.get(`/orders/users/${userId}`)
    return data
}


export const getOrderById = async ({ orderId }: { orderId: string }) => {
    const { data } = await axiosInstance.get(`/orders/${orderId}`)
    return data
}

