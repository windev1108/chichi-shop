import axios from "axios"



export const getProvince = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_GHN_ENDPOINT}/master-data/province`, {
        headers: {
            token: process.env.NEXT_PUBLIC_API_GHN_TOKEN
        }
    })
    return data
}


export const getDistrict = async ({ provinceId }: { provinceId: number }) => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_GHN_ENDPOINT}/master-data/district?province_id=${provinceId}`, {
        headers: {
            token: process.env.NEXT_PUBLIC_API_GHN_TOKEN
        }
    })
    return data
}


export const getWard = async ({ districtId }: { districtId: number }) => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_GHN_ENDPOINT}/master-data/ward?district_id=${districtId}`, {
        headers: {
            token: process.env.NEXT_PUBLIC_API_GHN_TOKEN
        }
    })
    return data
}


export const getServicePackage = async ({ toDistrictId }: { toDistrictId: number }) => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_GHN_ENDPOINT}/v2/shipping-order/available-services?shop_id=${process.env.NEXT_PULIC_API_GHN_SHOP_ID}&from_district=${process.env.NEXT_PUBLIC_API_GHN_FROM_DISTRICT_ID}&to_district=${toDistrictId}`, {
        headers: {
            token: process.env.NEXT_PUBLIC_API_GHN_TOKEN
        }
    })
    return data
}