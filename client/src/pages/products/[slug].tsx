import Layout from "@/components/Layout";
import { NextApiRequest, NextApiResponse, NextPage } from "next";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineStar } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { Product } from "@/utils/types";
import currencyFormatter from "currency-formatter";
import Image from "next/image";

export const getServerSideProps = async (
  req: NextApiRequest,
  _res: NextApiResponse
) => {
  const { product } = await getProductBySlug({
    slug: req.query.slug as string,
  });

  return {
    props: {
      product,
    },
  };
};

const ProductDetail: NextPage<{ product: Product }> = ({ product }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [state, setState] = useState<{
    amount: number;
    fileSelected: number | null;
  }>({
    amount: 1,
    fileSelected: null,
  });
  const { amount, fileSelected } = state;

  return (
    <Layout>
      <div className="px-40">
        <div className="flex space-x-28 my-20">
          <div className="w-1/2 flex flex-col space-y-2">
            <Swiper
              spaceBetween={1}
              navigation={true}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[Navigation, FreeMode, Thumbs]}
              className="lg:!w-full w-full  !h-[32rem]"
            >
              {product?.files.map((file) => (
                <SwiperSlide className="relative" key={file.id}>
                  <img
                    className="cursor-pointer h-full !w-full !object-cover"
                    src={file.url}
                    alt="pictures"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={false}
              modules={[Navigation, FreeMode, Thumbs]}
              className="w-full h-[5rem]"
            >
              {product.files?.map((file, index) => (
                <SwiperSlide key={file.id}>
                  <div
                    onClick={() => setState({ ...state, fileSelected: index })}
                  >
                    <Image
                      width={500}
                      height={500}
                      className=" cursor-pointer h-full !w-full !object-cover"
                      src={file.url}
                      alt="pictures"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="w-1/2 flex flex-col space-y-4">
            <h1 className="font-semibold text-2xl text-black">
              {product?.name}
            </h1>
            <div className="flex space-x-2">
              <h2 className="line-through text-black text-sm">
                {" "}
                {currencyFormatter.format(product?.sizeList[0].price!, {
                  code: "VND",
                })}
              </h2>
              <h1 className="text-red-500 font-semibold text-xl">
                {currencyFormatter.format(
                  product?.sizeList[0].price! -
                    (product?.sizeList[0].price! / 100) * product?.discount!,
                  {
                    code: "VND",
                  }
                )}
              </h1>
            </div>
            <div className="flex justify-between py-6">
              <h1 className="font-semibold text-black">Kích thước</h1>
              <select className="outline-none border px-4 py-2" name="" id="">
                {product.sizeList.map((size) => (
                  <option key={size.name} value={size.name}>
                    {size.name}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-sm ">{product.descriptions}</p>

            <div className="flex space-x-2 h-10">
              <div className="flex">
                <button className="flex-1 px-4 border">
                  <AiOutlineMinus />
                </button>
                <input
                  value={amount}
                  onChange={({ target }) =>
                    setState({ ...state, amount: +target.value })
                  }
                  className="text-center w-20 px-4 outline-none border"
                  type="text"
                />
                <button className="flex-1 px-4 border">
                  <AiOutlinePlus />
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg border hover:bg-opacity-70 hover:shadow-md w-1/2 text-center">
                Mua ngay
              </button>
              <button className="px-4 py-2 border border-gray-300 w-1/2  hover:bg-opacity-70 hover:shadow-md rounded-lg text-center">
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>

        <div className="p-10 my-20">
          <div className="flex mb-10">
            <h1 className="font-semibold">Đánh giá</h1>
          </div>
          <div className="flex items-center space-x-5">
            <div className="flex space-x-1 items-center text-gray-400 text-xl">
              <AiOutlineStar />
              <AiOutlineStar />
              <AiOutlineStar />
              <AiOutlineStar />
              <AiOutlineStar />
            </div>
            <span className="text-black">Sản phẩm này chưa có đánh giá</span>
          </div>

          {true ? (
            <div className="flex items-center border space-x-4 px-8 py-6 mt-8 rounded-lg">
              <FaUserCircle className="text-gray-500" size={40} />
              <div className="flex flex-col w-1/2 space-y-3">
                <div className="flex space-x-1 items-center text-gray-400 text-xl">
                  <AiOutlineStar />
                  <AiOutlineStar />
                  <AiOutlineStar />
                  <AiOutlineStar />
                  <AiOutlineStar />
                </div>
                <textarea
                  className="outline-none text-sm w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                  placeholder="Bạn có thể để lại đánh giá ở dây"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center border space-x-4 p-8 mt-8 rounded-lg">
              <FaUserCircle className="text-gray-500" size={40} />
              <span>
                Bạn cần{" "}
                <Link
                  className="hover:underline text-blue-500 inline"
                  href="/signin"
                >
                  đăng nhập
                </Link>{" "}
                để đánh giá
              </span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
