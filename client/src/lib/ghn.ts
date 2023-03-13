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
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_GHN_ENDPOINT}/v2/shipping-order/available-services?shop_id=${process.env.NEXT_PUBLIC_API_GHN_SHOP_ID}&from_district=${process.env.NEXT_PUBLIC_API_GHN_FROM_DISTRICT_ID}&to_district=${toDistrictId}`, {
        headers: {
            token: process.env.NEXT_PUBLIC_API_GHN_TOKEN
        }
    })
    return data
}


export const calculateFee = async ({ amount, toDistrictId, toWardCode, serviceId, serviceTypeId , type }: { toWardCode: number, type?: string , toDistrictId: number, amount: number, serviceId: number, serviceTypeId: number }) => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_GHN_ENDPOINT}/v2/shipping-order/fee?shop_id	=${process.env.NEXT_PUBLIC_API_GHN_SHOP_ID}&service_id=${serviceId}&service_type_id=${serviceTypeId}&from_district_id=${process.env.NEXT_PUBLIC_API_GHN_FROM_DISTRICT_ID}&to_ward_code=${toWardCode}&to_district_id=${toDistrictId}&weight=${type === "MATERIAL" ? 10 : 100 * amount}&length=2&width=10&height=2`, {
        headers: {
            token: process.env.NEXT_PUBLIC_API_GHN_TOKEN
        }
    })
    return data
}