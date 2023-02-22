import axios from 'axios';
import { File } from './types';

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

export const formatTextRendering = ({ text } : { text: string}) => {
    return text.replace(/\\n/g, "\n");
}

export const sleep = (cb: any = 3000, ms: number) => {
    setTimeout(() => cb(), ms)
}