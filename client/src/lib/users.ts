import axiosInstance from "@/services/instance"


export const createUser = async ({ email, name, password }: { email: string, name: string, password: string }) => {
    const { data } = await axiosInstance.post('/users', { email, name, password })
    return data
}

export const getUserByEmail = async ({ email }: { email: string }) => {
    const { data } = await axiosInstance.get(`/users/${email}`)
    return data
}