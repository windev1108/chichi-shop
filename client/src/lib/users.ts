import axiosInstance from "@/services/instance"
import { User } from "@/utils/types"


export const createUser = async ({ email, name, password, phone }: { phone: string, email: string, name: string, password: string }) => {
    const { data } = await axiosInstance.post('/users', { email, name, password, phone })
    return data
}

export const getUserById = async ({ id }: { id: string }) => {
    const { data } = await axiosInstance.get(`/users/${id}`)
    return data
}

export const updateUser = async ({ id, user }: { id: string, user: User }) => {
    const { data } = await axiosInstance.put(`/users/${id}`, user)
    return data
}