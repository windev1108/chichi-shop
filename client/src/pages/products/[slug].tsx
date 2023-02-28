import Layout from "@/components/Layout";
import { GetServerSidePropsContext, NextPage } from "next";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import {
  AiFillStar,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineStar,
} from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { Product } from "@/utils/types";
import currencyFormatter from "currency-formatter";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "@/redux/hook";
import { updateCart } from "@/redux/features/isSlice";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { MdSend } from "react-icons/md";
import { createReview } from "@/lib/reviews";
import { useRouter } from "next/router";
import moment from "moment";
import {
  formatCurrency,
  formatCurrencyWithDiscount,
  formatTextRendering,
} from "@/utils/constants";
import { addProductToCart } from "@/lib/cart";

export const getServerSideProps = async ({
  req,
  res,
  query,
}: GetServerSidePropsContext) => {
  const session: any = await getServerSession(req, res, authOptions);
  const { product } = await getProductBySlug({
    slug: query.slug as string,
  });

  return {
    props: {
      session,
      product: product || null,
      origin: `${
        req.headers.host?.includes("localhost") ? "http" : "https"
      }://${req.headers.host}`,
    },
  };
};

const ProductDetail: NextPage<{ product: Product }> = ({ product }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [state, setState] = useState<{
    amount: number;
    size: {
      id?: string;
      name?: string;
      amount?: number;
      price?: number;
    };
    point: number;
    content: string;
  }>({
    amount: 1,
    point: 0,
    content: "",
    size: product?.sizeList[0],
  });
  const { amount, size, point, content } = state;

  const handleAddToCart = React.useCallback(async () => {
    if (!amount) {
      toast.error("Vui lòng nhập số lượng");
      return;
    }

    if (amount > size?.amount!) {
      toast.error("Số lượng của bạn lớn hơn số lượng tồn kho");
      return;
    }
    await addProductToCart({
      userId: session?.user.id!,
      productId: product?.id as string,
      amount,
      sizeId: size?.id as string,
    });
    dispatch(updateCart());
  }, [amount, size]);

  const handleSubmitReview = React.useCallback(async () => {
    try {
      if (!content) {
        toast.error("Vui lòng nhập nôi dung đánh giá");
        return;
      }

      await createReview({
        productId: product?.id as string,
        review: {
          content,
          point,
          userId: session?.user.id,
        },
      });

      setState({ ...state, content: "", point: 0 });
      router.replace(router.asPath);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [content, point]);

  return (
    <Layout>
      <div className="lg:px-40 px-4">
        <div className="flex lg:flex-nowrap flex-wrap lg:space-x-28 space-x-0 lg:space-y-0 space-y-12 my-28">
          <div className="lg:w-1/2 w-full lg:h-full h-[50vh] flex flex-col space-y-2">
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
              {product?.files?.map((file) => (
                <SwiperSlide className="relative" key={file.url}>
                  <Image
                    className="cursor-pointer h-full !w-full !object-cover"
                    src={file.url}
                    width={500}
                    height={500}
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
              {product?.files?.map((file) => (
                <SwiperSlide key={file.url}>
                  <Image
                    width={500}
                    height={500}
                    className=" cursor-pointer h-full !w-full !object-cover"
                    src={file.url}
                    alt="pictures"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="lg:w-1/2 w-full flex flex-col space-y-4">
            <h1 className="font-semibold lg:text-2xl text-xl text-black">
              {product?.name}
            </h1>
            <div className="flex space-x-2">
              <h2 className="line-through text-black lg:text-sm text-xs">
                {" "}
                {formatCurrency({ price: size?.price! })}
              </h2>
              <h1 className="text-red-500 font-semibold lg:text-xl text-base">
                {formatCurrencyWithDiscount({
                  price: size?.price!,
                  discount: product?.discount!,
                })}
              </h1>
            </div>
            <div className="flex flex-col py-6">
              <h1 className="font-semibold text-black lg:text-base text-sm">
                Kích thước
              </h1>
              <div className="grid lg:grid-cols-6 grid-cols-4 gap-4 my-4">
                {product?.sizeList.map((item) => (
                  <button
                    onClick={() => setState({ ...state, size: item })}
                    className={`${
                      item!.id! === size?.id! ? "border-orange-400" : "border"
                    } border-2 px-3 py-1 text-black font-semibold text-sm`}
                    key={item.id as string}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {product?.descriptions && (
              <div className="flex flex-col">
                <h1 className="font-semibold text-black lg:text-base text-sm">
                  Mô tả
                </h1>
                <p className="text-sm whitespace-pre-wrap">
                  {formatTextRendering({ text: product?.descriptions })}
                </p>
              </div>
            )}

            <div className="flex lg:space-x-6 space-x-2 items-center lg:py-10 py-6">
              <div className="h-10 flex flex-1">
                <button
                  type="button"
                  onClick={() => setState({ ...state, amount: amount - 1 })}
                  className="px-4 border"
                >
                  <AiOutlineMinus />
                </button>
                <input
                  value={amount}
                  onChange={({ target }) =>
                    setState({ ...state, amount: +target.value })
                  }
                  className="text-center w-20 px-4 outline-none border"
                  type="number"
                />
                <button
                  type="button"
                  onClick={() => setState({ ...state, amount: amount + 1 })}
                  className="px-4 border"
                >
                  <AiOutlinePlus />
                </button>
              </div>

              <span className="flex-1  text-sm whitespace-nowrap">
                Số lượng tồn kho :
                <h1 className="inline-block mx-2 font-bold text-sm">
                  {size?.amount}
                </h1>
              </span>
            </div>
            <div className="flex lg:space-x-4 space-x-2">
              <button
                type="submit"
                className="lg:px-4 py-2 bg-blue-500 text-white rounded-lg border hover:bg-opacity-70 hover:shadow-md w-1/2 text-center"
              >
                Mua ngay
              </button>

              <button
                onClick={handleAddToCart}
                className="lg:px-4 py-2 border border-gray-300 w-1/2  hover:bg-opacity-70 hover:shadow-md rounded-lg text-center"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>

        <div className="lg:p-10 my-20">
          <div className="flex lg:mb-10 mb-6">
            <h1 className="font-semibold">Đánh giá</h1>
          </div>
          <div className="flex items-center space-x-5">
            <div className="flex space-x-1 items-center lg:text-xl text-base">
              {Array.from({ length: 5 }).map((_item, index) => (
                <React.Fragment key={index}>
                  {product?.averageRating! >= index + 1 ? (
                    <AiFillStar className="text-yellow-500" />
                  ) : (
                    <AiOutlineStar className="text-gray-400 " />
                  )}
                </React.Fragment>
              ))}
            </div>
            {product?.averageRating === 0 ? (
              <span className="text-black lg:text-base text-sm">
                Sản phẩm này chưa có đánh giá
              </span>
            ) : (
              <span className="font-semibold text-black lg:text-base text-sm">{`Dựa trên ${product
                .reviews?.length!} lượt đánh giá`}</span>
            )}
          </div>

          {status === "authenticated" ? (
            <div className="flex items-center border space-x-4 p-4  mt-8 rounded-lg">
              <Image
                src={
                  session?.user.image
                    ? session?.user?.image
                    : require("@/resources/images/noAvatar.webp")
                }
                alt=""
                className="w-10 h-10 rounded-full object-cover"
                width={100}
                height={100}
              />
              <div className="flex flex-col w-full space-y-1">
                <div className="flex space-x-1 items-center text-gray-400 lg:text-xl text-base mb-2">
                  {Array.from({ length: 5 }).map((_item, index) => (
                    <React.Fragment key={index}>
                      {point >= index + 1 ? (
                        <AiFillStar
                          onClick={() => {
                            if (point === index + 1) {
                              setState({ ...state, point: 0 });
                            } else {
                              setState({ ...state, point: index + 1 });
                            }
                          }}
                          className="cursor-pointer text-yellow-500"
                        />
                      ) : (
                        <AiOutlineStar
                          onClick={() =>
                            setState({ ...state, point: index + 1 })
                          }
                          className="cursor-pointer"
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <textarea
                  value={content}
                  onChange={({ target }) =>
                    setState({ ...state, content: target.value })
                  }
                  className="outline-none flex-1  border rounded-md px-4 py-2  text-sm w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                  placeholder="Bạn có thể để lại đánh giá ở dây"
                />
              </div>
              <button
                onClick={handleSubmitReview}
                className="active:scale-105 items-center mt-5 hover:bg-gray-300 bg-gray-100 rounded-full p-2"
                type="button"
              >
                <MdSend className="text-2xl text-blue-500" />
              </button>
            </div>
          ) : (
            <div className="flex items-center border space-x-4  p-4 mt-8 rounded-lg lg:text-base text-sm">
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

          <div className="flex flex-col space-y-2 my-10">
            {product?.reviews?.map(({ user, content, point, createdAt, id }) => (
              <div
                key={id}
                className="relative flex space-x-4 items-center border px-4 py-2 rounded-lg"
              >
                <Image
                  className="w-10 h-10 rounded-full object-cover"
                  width={100}
                  height={100}
                  src={
                    user?.image
                      ? user.image.url
                      : require("@/resources/images/noAvatar.webp")
                  }
                  alt=""
                />
                <div className="flex flex-col space-y-1 w-full">
                  <div className="flex w-full justify-between">
                    {point > 0 && (
                      <div className="flex space-x-1 items-center text-gray-400 lg:text-base text-sm">
                        {Array.from({ length: 5 }).map((_item, index) => (
                          <React.Fragment key={index}>
                            {point >= index + 1 ? (
                              <AiFillStar
                                onClick={() => {
                                  if (point === index + 1) {
                                    setState({ ...state, point: 0 });
                                  } else {
                                    setState({ ...state, point: index + 1 });
                                  }
                                }}
                                className="cursor-pointer text-yellow-500"
                              />
                            ) : (
                              <AiOutlineStar
                                onClick={() =>
                                  setState({ ...state, point: index + 1 })
                                }
                                className="cursor-pointer"
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                    <span className="absolute top-2 right-2 lg:text-sm text-xs">
                      {moment(new Date(createdAt!), "x").fromNow()}
                    </span>
                  </div>
                  <Link href={`/profile?id=${user?.id}`}>
                    <h1 className="cursor-pointer font-bold text-sm hover:underline">
                      {user?.name!}
                    </h1>
                  </Link>
                  <h1 className="text-sm font-normal">{content}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
