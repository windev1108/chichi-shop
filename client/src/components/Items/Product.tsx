import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BiShoppingBag } from "react-icons/bi";
import currencyFormatter from "currency-formatter";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { updateCart } from "@/redux/features/isSlice";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/redux/hook";
import { addProductToCart } from "@/lib/cart";
import { BsFillCartPlusFill } from "react-icons/bs";
const ProductItem: NextPage<{
  id: string;
  slug: string;
  image: string;
  name: string;
  price: number;
  discount: number;
  review: number;
  sold: number;
  sizeId: string;
  averageRating: number;
}> = ({
  id,
  slug,
  image,
  price,
  discount,
  name,
  sold,
  review,
  sizeId,
  averageRating,
}) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const handleAddToCart = React.useCallback(async () => {
    try {
      if(!session?.user){
        toast.error("Vui lòng đăng nhập")
        return
      }

      const { success, message } = await addProductToCart({
        userId: session?.user?.id!,
        productId: id,
        amount: 1,
        sizeId: sizeId,
      });
      if (success) {
        toast.success(message);
        dispatch(updateCart());
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      toast.error(error.message);

    }
  }, []);

  return (
    <div className="group hover:shadow-lg hover:-translate-y-1 shadow-md border overflow-hidden relative flex flex-col  h-fit cursor-pointer rounded-lg  transition-all duration-500">
      <button
        onClick={handleAddToCart}
        title="Thêm vào giỏ hàng"
        className="group-hover:translate-x-0 translate-x-[-100%] transition-all duration-500 ease-in-out absolute top-0 left-0 lg:w-12 w-10 lg:h-12 h-10 bg-gray-100 shadow  flex justify-center items-center"
      >
        <BsFillCartPlusFill className="text-xl text-green-500" />
      </button>
      <Link href={`/products/${slug}`}>
        <>
          {discount > 0 && (
            <div className="absolute top-0 right-0 lg:w-12 w-10 lg:h-12 h-10 lg:text-sm text-xs bg-yellow-500 flex justify-center items-center ">
              <span className="font-semibold text-white">{`-${discount}%`}</span>
            </div>
          )}

          <div className=" h-[60%]">
            {!image ? (
              <div className="w-full ! h-full bg-gray-200 animate-pulse"></div>
            ) : (
              <Image
                width={500}
                height={500}
                className="object-cover w-full h-full"
                src={image}
                alt=""
              />
            )}
          </div>
          <div className="h-[40%] lg:px-4 px-2 py-2 flex flex-col space-y-2 justify-between">
            <span className="text-gray-500 line-through lg:text-sm text-[13px] whitespace-nowrap">
              {discount > 0 &&
                currencyFormatter.format(+price, {
                  code: "VND",
                })}
              <h1
                className={`${
                  discount > 0 && "mx-2"
                } font-bold inline-block text-red-500`}
              >
                {" "}
                {currencyFormatter.format(
                  Math.floor(+(price - (price / 100) * discount) / 1000) * 1000,
                  {
                    code: "VND",
                  }
                )}
              </h1>
            </span>
            <h1 className="font-semibold lg:text-sm text-xs text-black truncate">
              {name}
            </h1>
            <div className="flex space-x-2 justify-between">
              <div className="flex space-x-1 lg:text-lg text-xs items-center">
                {Array.from({ length: 5 }).map((_item, index) => (
                  <React.Fragment key={index}>
                    {averageRating >= index + 1 ? (
                      <AiFillStar className="text-yellow-500" />
                    ) : (
                      <AiOutlineStar className="text-gray-400" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              {review > 0 && (
                <span className="lg:text-sm text-xs whitespace-nowrap">{`(${review} đánh giá)`}</span>
              )}
            </div>
            <div className="flex justify-between">
              <BiShoppingBag className="text-green-600" size={20} />
              <span className="lg:text-sm text-xs font-semibold text-black">{`Đá bán ${
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
