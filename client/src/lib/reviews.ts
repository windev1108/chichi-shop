import axiosInstance from '@/services/instance';
import { Review } from '@/utils/types'


export const createReview = async ({review, productId } : { review : Review , productId: string}) => {
    const { data } = await axiosInstance.post(`/products/${productId}/reviews`, review)
    return data
}