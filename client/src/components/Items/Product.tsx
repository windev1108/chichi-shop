import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { AiFillStar } from "react-icons/ai";
import { BiShoppingBag } from "react-icons/bi";
import currencyFormatter from "currency-formatter";

const ProductItem: NextPage<{
  id: string;
  slug: string;
  image: string;
  name: string;
  price: number;
  discount: number;
  review: number;
  sold: number;
}> = ({ slug, image, price, discount, name, sold, review }) => {
  return (
    <div className="group hover:shadow-lg hover:-translate-y-1 shadow-md border relative flex flex-col h-full cursor-pointer rounded-lg  transition-all duration-500">
      <Link href={`/products/${slug}`}>
        <>
          {discount > 0 && (
            <div className="absolute top-0 right-0 w-12 h-12 bg-yellow-500 flex justify-center items-center ">
              <span className="font-semibold text-white">{`-${discount}%`}</span>
            </div>
          )}
          <div className="h-[60%]">
            {!image ? (
              <div className="w-full ! h-full bg-gray-200 animate-pulse"></div>
            ) : (
              <img className="object-cover w-full h-full" src={image} alt="" />
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

export default ProductItem;
