import axios from 'axios';
import currencyFormatter from "currency-formatter";
import { Cart, File } from './types';

export const genderList = ["MALE", "FEMALE"]

export const uploadMultipleImage = async (files: { url: string, type?: string | undefined, file: any }[]) => {
    const promises = Array.from(files).map(async ({ file, url, type }) => {
        URL.revokeObjectURL(url)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'my-uploads');
        const { data } = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME
            }/${file.type.includes('video') ? 'video' : 'image'}/upload`,
            formData
        );
        return {
            type,
            url: data.url,
            publicId: data.public_id
        };
    });
    return await Promise.all(promises);
};

export const uploadSingleImage = async (file: { origin: any, type: string, url: string }) => {
    const formData = new FormData();
    formData.append('file', file.origin);
    formData.append('upload_preset', 'my-uploads');
    const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME
        }/${file.type.includes('video') ? 'video' : 'image'}/upload`,
        formData
    );

    return Promise.resolve({ url: data.url, type: file.type, publicId: data.public_id })
}


export const destroyMultipleImage = async (files: File[]) => {
    const results = files.map(async (file) => {
        const result = await axios.post(`/api/destroy/${file.publicId}`);
        return {
            result,
        };
    });

    return await Promise.all(results);
};

export const destroySingleImage = async (file: File) => {
    const result = await axios.post(`/api/destroy/${file.publicId}`)
    return Promise.resolve(result)
}

export const formatText = ({ text }: { text: string }) => {
    return text.replace(/\n/g, "\\n");
}

export const formatTextRendering = ({ text }: { text: string }) => {
    return text.replace(/\\n/g, "\n");
}

export const formatCurrency = ({ price, amount = 1 }: { price: number, amount?: number }) => {
    return currencyFormatter.format(price * amount, {
        code: "VND",
    })
}

export const formatCurrencyWithDiscount = ({ price, discount }: { price: number, discount: number }) => {
    return currencyFormatter.format(Math.floor(
        (price - (price! / 100) * discount!)
    ), {
        code: "VND",
    })

}

export const formatPriceWithDiscount = ({ price, discount, amount }: { price: number, discount: number, amount: number }) => {
    return Math.floor(
        ((price - (price! / 100) * discount!) * amount)
    )
}


export const formatDiscount = ({ price, discount, amount }: { price: number, discount: number, amount: number }) => {
    return Math.floor(
        ((price / 100) * discount) * amount)
}



export const formatTotalCurrencyWithDiscount = ({ price, amount, discount }: { price: number, discount: number, amount: number }) => {
    return currencyFormatter.format(
        Math.floor(
            +(
                price! -
                (price! / 100) *
                discount!
            )
            * amount!,
        ) / 10000 * 10000,
        {
            code: "VND",
        }
    )
}



export const sleep = (cb: any, ms = 3000) => {
    setTimeout(() => cb(), ms)
}


export const isValidName = (name: string) => {
    if (name.length < 2 || name.length > 30) {
        return false;
    }
    return true;
};

export const isValidPassword = (password: string) => {
    if (password.length < 8) {
        return false;
    }
    if (!/\d/.test(password)) {
        return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return false;
    }
    return true;
};


export const isValidPhone = (phone: string) => {
    var phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return phone.match(phoneRegex) ? true : false

}

