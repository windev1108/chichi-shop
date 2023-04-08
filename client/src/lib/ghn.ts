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
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_GHN_ENDPOINT}/master-data/district?province_id=${+provinceId}`, {
        headers: {
            token: process.env.NEXT_PUBLIC_API_GHN_TOKEN
        }
    })
    return data
}


export const getWard = async ({ districtId }: { districtId: number }) => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_GHN_ENDPOINT}/master-data/ward?district_id=${+districtId}`, {
        headers: {
            token: process.env.NEXT_PUBLIC_API_GHN_TOKEN
        }
    })
    return data
}


export const getServicePackage = async ({ toDistrictId }: { toDistrictId: number }) => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_GHN_ENDPOINT}/v2/shipping-order/available-services?shop_id=${parseInt(process.env.NEXT_PUBLIC_API_GHN_SHOP_ID!)}&from_district=${parseInt(process.env.NEXT_PUBLIC_API_GHN_FROM_DISTRICT_ID!)}&to_district=${toDistrictId!}`, {
        headers: {
            token: process.env.NEXT_PUBLIC_API_GHN_TOKEN
        }
    })

    return data
}


export const calculateFee = async ({ amount, deliverOption , totalOrder , address, province, district, ward }: { address: string , province: string, district: string , ward: string , totalOrder: number, deliverOption?: string, amount: number }) => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_GHTK_ENDPOINT}/services/shipment/fee?address=${address}&province=${province}&district=${district}&ward=${ward}&pick_province=${process.env.NEXT_PUBLIC_API_GHTK_PICK_PROVINCE}&pick_district=${process.env.NEXT_PUBLIC_API_GHTK_PICK_DISTRICT}&pick_address=${process.env.NEXT_PUBLIC_API_GHTK_PICK_ADDRESS}&weight=${100 * amount}&value=${totalOrder}&deliver_option=${deliverOption}`, {
        headers: {
            Token: process.env.NEXT_PUBLIC_API_GHTK_TOKEN,
            "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_ORIGIN_URL,
            "Referer": process.env.NEXT_PUBLIC_ORIGIN_URL,
            "Content-Type": "application/json"
        }
    })
    return data
}