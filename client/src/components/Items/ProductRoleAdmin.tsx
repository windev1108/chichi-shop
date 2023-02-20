import { NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import {
  AiFillDelete,
  AiFillStar,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { BiShoppingBag } from "react-icons/bi";
import currencyFormatter from "currency-formatter";
import { deleteProduct } from "@/lib/products";
import { FiEdit } from "react-icons/fi";
import { GrView } from "react-icons/gr";
import { useRouter } from "next/router";
import { File } from "@/utils/types";
import { destroyMultipleImage } from "@/utils/constants";
import { toast } from "react-hot-toast";
import Image from "next/image";

const ProductRoleAdmin: NextPage<{
  id: string;
  slug: string;
  files: File[];
  name: string;
  price: number;
  discount: number;
  review: number;
  sold: number;
  isAdmin: boolean;
}> = ({ id, slug, files, price, discount, name, sold, review, isAdmin }) => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const router = useRouter();

  const handleDeleteProduct = React.useCallback(async () => {
    setIsLoading(true);
    await deleteProduct({
      productId: id as string,
    });
    // destroy images
    await destroyMultipleImage(files);
    setIsLoading(false);
    toast.success("Xóa sản phẩm thành công");
    router.replace(router.asPath);
  }, [id]);

  return (
    <div className="group hover:shadow-lg hover:-translate-y-1 shadow-md border relative flex flex-col h-full cursor-pointer rounded-lg  transition-all duration-500">
      {isAdmin && (
        <div className="group-hover:flex hidden space-x-2 justify-center items-center absolute top-0 right-0 bottom-0 left-0 bg-[#11111170] z-[10]">
          <button
            disabled={isLoading}
            onClick={handleDeleteProduct}
            title="Xóa"
            className={`${
              isLoading ? "cursor-not-allowed" : "cursor-pointer"
            } px-4 py-2 rounded-lg text-red-500 bg-white hover:bg-gray-300`}
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className="text-blue-500 animate-spin duration-500 ease-linear" />
            ) : (
              <AiFillDelete />
            )}
          </button>
          <Link href={`${router.pathname}?slug=${slug}`}>
            <button
              disabled={isLoading}
              title="Sửa"
              className={`${
                isLoading ? "cursor-not-allowed" : "cursor-pointer"
              } px-4 py-2 rounded-lg text-blue-500 bg-white hover:bg-gray-300`}
            >
              <FiEdit />
            </button>
          </Link>
          <Link href={`/products/${slug}`}>
            <button
              disabled={isLoading}
              title="Xem"
              className={`${
                isLoading ? "cursor-not-allowed" : "cursor-pointer"
              } px-4 py-2 rounded-lg text-green-500 bg-white hover:bg-gray-300`}
            >
              <GrView />
            </button>
          </Link>
        </div>
      )}
      <Link href={`/products/${slug}`}>
        <>
          {discount > 0 && (
            <div className="absolute top-0 right-0 w-12 h-12 bg-yellow-500 flex justify-center items-center ">
              <span className="font-semibold text-white">{`-${discount}%`}</span>
            </div>
          )}
          <div className="h-[60%]">
            {!files[0]?.url ? (
              <img
                className="animate-pulse object-cover w-full h-full"
                src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
                alt=""
              />
            ) : (
              <Image
                width={500}
                height={500}
                className="object-cover w-full h-full"
                src={files[0]?.url!}
                alt=""
              />
            )}
          </div>
          <div className="h-[40%] px-4 py-2 flex flex-col space-y-2 justify-between">
            <span className="text-gray-500 line-through text-sm">
              {discount > 0 &&
                currencyFormatter.format(price, {
                  code: "VND",
                })}
              <h1
                className={`${
                  discount > 0 && "mx-2"
                } font-bold inline-block text-red-500`}
              >
                {" "}
                {currencyFormatter.format(price - (price / 100) * discount, {
                  code: "VND",
                })}
              </h1>
            </span>
            <h1 className="font-semibold text-sm text-black truncate">
              {name}
            </h1>
            <div className="flex space-x-2 justify-between">
              <div className="flex space-x-1 text-sm text-yellow-500 items-center">
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
              </div>
              <span className="font-semibold text-sm whitespace-nowrap">{`(${review} đánh giá)`}</span>
            </div>
            <div className="flex justify-between">
              <BiShoppingBag className="text-green-600" size={20} />
              <span className="text-sm font-semibold text-black">{`Đá bán ${
                sold || 0
              }`}</span>
            </div>
          </div>
        </>
      </Link>
    </div>
  );
};

export default ProductRoleAdmin;
