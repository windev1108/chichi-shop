import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL as string 
})


export default axiosInstance